import dayjs from "dayjs/esm"
import timezone from "dayjs/esm/plugin/timezone"
import utc from "dayjs/esm/plugin/utc"

dayjs.extend(utc)
dayjs.extend(timezone)

// Fergus jobs for "Track my repair" (customers) and the staff app (mechanics): one job model,
// read from the Fergus Open API, with the notes and photos on the job and its phases. With
// NUXT_FERGUS_MOCK=true (and no token) a pretend workshop is used instead; changes made in the
// staff app are kept in memory until restart, so the tracker shows them too.
//
// Fergus notes and photos are internal by default. Customers only see notes the mechanic pins,
// and photos whose file name starts with "customer" (Fergus files can't be pinned).

export const sharedPhotoPrefix = "customer"

export interface JobNote {
  id: string
  text: string
  at: string
  // First name of the staff member who wrote it, when known.
  by?: string
  shared: boolean
}

export interface JobPhoto {
  id: string
  at: string
  by?: string
  shared: boolean
}

export interface FergusJob {
  id: number
  jobNo: string
  title: string
  description: string
  status: string
  onHold: boolean
  updated: string
  customer: string
  contact: { name: string; emails: string[]; phones: string[] }
  site: { name: string; lines: string[] }
  phases: { id: number; title: string; status: string }[]
  notes: JobNote[]
  photos: JobPhoto[]
}

interface FergusNote {
  id: number
  text?: string
  createdAt: string
  isPinned?: boolean
  createdById?: number | null
}
interface FergusFile {
  id: number
  fileName?: string
  mimeType?: string
  createdAt: string
  createdBy?: number | null
}
interface FergusJobResponse {
  id: number
  jobNo?: string | number
  description?: string | null
  longDescription?: string | null
  status: string
  onHold?: boolean
  archived?: boolean
  lastModified?: string | null
  createdAt: string
  customer?: { customerFullName?: string }
  siteAddress?: {
    name?: string | null
    address1?: string | null
    address2?: string | null
    addressSuburb?: string | null
    addressCity?: string | null
    addressPostcode?: string | null
  }
  mainContact?: {
    firstName?: string | null
    lastName?: string | null
    contactItems?: { contactType?: string; contactValue?: string }[]
  }
}

// Staff first names by Fergus user id. First names only: customers don't need staff surnames.
// Refreshed hourly; a failure just leaves names off.
let staff: { at: number; names: Map<number, string> } | undefined
async function staffNames() {
  if (staff && Date.now() - staff.at < 36e5) return staff.names
  const response = await fergusCall<{
    data: { id: number; firstName?: string }[]
  }>("/users", { query: { pageSize: "100" } })
  const names = new Map<number, string>()
  if (response.status < 400)
    for (const user of response._data?.data ?? [])
      if (user.firstName?.trim()) names.set(user.id, user.firstName.trim())
  staff = { at: Date.now(), names }
  return names
}

// A job with everything on it. `extras` false skips the notes, photos and staff names (and
// their Fergus calls).
async function readJob(raw: FergusJobResponse, extras: boolean) {
  const phases = await fergusCall<{
    data: { id: number; title?: string; status?: string }[]
  }>(`/jobs/${raw.id}/phases`)
  fergusCheck(phases, "job phases")
  const phaseList = phases._data?.data ?? []

  // A failure here only loses the extras, never the job.
  const entities = !extras
    ? []
    : [
        { note: "JOB", file: "job", id: raw.id },
        ...phaseList.map((p) => ({
          note: "JOB_PHASE",
          file: "job_phase",
          id: p.id,
        })),
      ]
  const [notes, files, names] = await Promise.all([
    Promise.all(
      entities.map(async (e) => {
        const r = await fergusCall<{ data: FergusNote[] }>("/notes", {
          query: {
            filterEntityName: e.note,
            filterEntityId: String(e.id),
            pageSize: "50",
          },
        })
        return r.status < 400 ? (r._data?.data ?? []) : []
      }),
    ),
    Promise.all(
      entities.map(async (e) => {
        const r = await fergusCall<{ data: FergusFile[] }>("/attachments", {
          query: { entityType: e.file, entityId: String(e.id), pageSize: "50" },
        })
        return r.status < 400 ? (r._data?.data ?? []) : []
      }),
    ),
    extras ? staffNames() : new Map<number, string>(),
  ])
  const userName = (id?: number | null) => (id ? names.get(id) : undefined)

  const items = raw.mainContact?.contactItems ?? []
  const site = raw.siteAddress ?? {}
  return {
    id: raw.id,
    jobNo: String(raw.jobNo ?? ""),
    title: raw.description?.trim() || `Job ${raw.jobNo}`,
    description: raw.longDescription?.trim() || "",
    status: raw.status,
    onHold: !!raw.onHold,
    updated: raw.lastModified || raw.createdAt,
    customer: raw.customer?.customerFullName ?? "",
    contact: {
      name: [raw.mainContact?.firstName, raw.mainContact?.lastName]
        .filter(Boolean)
        .join(" "),
      emails: items
        .filter((i) => i.contactType === "email")
        .map((i) => i.contactValue ?? ""),
      phones: items
        .filter((i) => i.contactType !== "email")
        .map((i) => i.contactValue ?? ""),
    },
    site: {
      name: site.name ?? "",
      lines: [
        site.address1,
        site.address2,
        site.addressSuburb,
        site.addressCity,
        site.addressPostcode,
      ].filter((l): l is string => !!l?.trim()),
    },
    phases: phaseList.map((p) => ({
      id: p.id,
      title: p.title ?? "",
      status: p.status ?? "",
    })),
    notes: notes
      .flat()
      .filter((n) => n.text?.trim())
      .map((n) => {
        // Notes written in the staff app are signed by the mechanic (the API writes them as
        // the token's user).
        const signed = parseSignedNote(n.text!.trim())
        return {
          id: String(n.id),
          text: signed.text,
          at: n.createdAt,
          by: signed.by ?? userName(n.createdById),
          shared: !!n.isPinned,
        }
      })
      .toSorted((a, b) => b.at.localeCompare(a.at)),
    photos: files
      .flat()
      .filter((f) => f.mimeType?.startsWith("image/"))
      .map((f) => ({
        id: String(f.id),
        at: f.createdAt,
        by: photoAuthor(f.fileName ?? "") ?? userName(f.createdBy),
        shared: !!f.fileName?.toLowerCase().startsWith(sharedPhotoPrefix),
      }))
      .toSorted((a, b) => b.at.localeCompare(a.at)),
  } satisfies FergusJob
}

// A live job by its number (tracker, staff search). Undefined if there's none.
export async function fergusJobByNumber(jobNo: string, extras = true) {
  if (fergusIsMock()) {
    const job = mockSorted(
      Object.values(mockJobs()).find((j) => j.jobNo === jobNo),
    )
    return job && (extras ? job : { ...job, notes: [], photos: [] })
  }
  const found = await fergusCall<{ data: FergusJobResponse[] }>("/jobs", {
    query: { filterJobNo: jobNo, filterShowOnHold: "true", pageSize: "5" },
  })
  fergusCheck(found, "job search")
  const raw = found._data?.data.find(
    (j) => String(j.jobNo) === jobNo && !j.archived && j.status !== "Inactive",
  )
  return raw && (await readJob(raw, extras))
}

// A job by its Fergus id (staff app).
export async function fergusJobById(id: number) {
  if (fergusIsMock()) return mockSorted(mockJobs()[id])
  const found = await fergusCall<{ data: FergusJobResponse }>(`/jobs/${id}`)
  if (found.status === 404) return undefined
  fergusCheck(found, "job")
  return await readJob(found._data!.data, true)
}

// "Track my repair": the customer's view of a job, or undefined. Only shared notes and photos.
export async function fergusRepairJob(jobNo: string, updates: boolean) {
  const job = await fergusJobByNumber(jobNo, updates)
  if (!job) return undefined
  return {
    ...job,
    notes: job.notes.filter((n) => n.shared),
    photos: job.photos.filter((p) => p.shared),
  }
}

// Tracker answers cached for a minute per job number, so repeated checks (or someone hammering
// the form) can't use up the company's Fergus allowance. Staff changes clear a job's entry.
const repairCache = new Map<
  string,
  { at: number; job: Awaited<ReturnType<typeof fergusRepairJob>> }
>()
export async function cachedRepairJob(jobNo: string, updates: boolean) {
  const hit = repairCache.get(jobNo)
  if (hit && Date.now() - hit.at < 60_000) return hit.job
  const job = await fergusRepairJob(jobNo, updates)
  if (repairCache.size > 1000) repairCache.clear()
  repairCache.set(jobNo, { at: Date.now(), job })
  return job
}
export const forgetRepairJob = (jobNo: string) => repairCache.delete(jobNo)

// Where a photo can be downloaded: Fergus answers with a redirect to a short-lived signed file
// URL, which the site passes on (the API token never reaches the browser). Mock photos are
// served by the site itself (mockPhoto).
export async function fergusPhotoUrl(id: string) {
  if (fergusIsMock())
    return mockPhotoFiles.has(id)
      ? `/api/staff/mock-photo/${id}`
      : mockSamplePhotos[id]
  const runtimeConfig = useRuntimeConfig()
  const response = await $fetch.raw(
    `${fergusBase}/attachments/${id}/download`,
    {
      headers: { Authorization: `Bearer ${runtimeConfig.fergusApiToken}` },
      redirect: "manual",
      ignoreResponseError: true,
    },
  )
  return response.headers.get("location") ?? undefined
}

// --- Staff actions -------------------------------------------------------------------------

export interface DiaryEntry {
  start: string
  end: string
  allDay: boolean
  title: string
  jobId?: number
  jobNo?: string
  customer?: string
  site?: string
  status?: string
  onHold?: boolean
}

// A mechanic's diary: their calendar events on `day` (YYYY-MM-DD), with each job's number,
// customer and site.
export async function fergusDiary(
  userId: number,
  day: string,
): Promise<DiaryEntry[]> {
  if (fergusIsMock()) return mockDiary(day)
  const events = await fergusCall<{
    data: {
      title?: string
      startTime: string
      endTime: string
      isAllDay?: boolean
      isActive?: boolean
      jobId?: number | null
    }[]
  }>("/calendarEvents", {
    query: {
      filterUserId: String(userId),
      filterDateFrom: `${day}T00:00:00+00:00`,
      filterCalendarRange: "DAY",
      filterActiveOnly: "true",
    },
  })
  fergusCheck(events, "diary")
  const list = (events._data?.data ?? []).toSorted((a, b) =>
    a.startTime.localeCompare(b.startTime),
  )
  // One job lookup per distinct job (usually a handful a day).
  const ids = [...new Set(list.map((e) => e.jobId).filter((id) => !!id))]
  const jobs = new Map<number, FergusJobResponse>()
  await Promise.all(
    ids.map(async (id) => {
      const r = await fergusCall<{ data: FergusJobResponse }>(`/jobs/${id}`)
      if (r.status < 400 && r._data) jobs.set(id!, r._data.data)
    }),
  )
  return list.map((e) => {
    const job = e.jobId ? jobs.get(e.jobId) : undefined
    const site = job?.siteAddress
    return {
      start: e.startTime,
      end: e.endTime,
      allDay: !!e.isAllDay,
      title: e.title ?? "",
      jobId: e.jobId ?? undefined,
      jobNo: job ? String(job.jobNo) : undefined,
      customer: job?.customer?.customerFullName,
      site: [site?.name, site?.addressCity].filter(Boolean).join(", "),
      status: job?.status,
      onHold: job?.onHold,
    }
  })
}

// Adds a note to the job, signed by the mechanic. `shared` pins it, so the customer sees it.
export async function fergusAddNote(
  jobId: number,
  text: string,
  shared: boolean,
  by: string,
) {
  if (fergusIsMock()) {
    mockJobs()[jobId]?.notes.unshift({
      id: `n${Date.now()}`,
      text,
      at: new Date().toISOString(),
      by,
      shared,
    })
    return
  }
  const response = await fergusCall("/notes", {
    method: "POST",
    body: {
      text: signNote(text, by),
      entityName: "JOB",
      entityId: jobId,
      isPinned: shared,
    },
  })
  fergusCheck(response, "new note")
}

// Attaches a photo to the job. Its file name carries whether it's shared and who took it.
export async function fergusAddPhoto(
  jobId: number,
  photo: { data: Buffer; type: string },
  shared: boolean,
  by: string,
) {
  const fileName = photoFileName(shared, by)
  if (fergusIsMock()) {
    const id = `p${Date.now()}`
    mockPhotoFiles.set(id, photo)
    mockJobs()[jobId]?.photos.unshift({
      id,
      at: new Date().toISOString(),
      by,
      shared,
    })
    return
  }
  const form = new FormData()
  form.append(
    "file",
    new Blob([new Uint8Array(photo.data)], { type: photo.type }),
    fileName,
  )
  form.append("entityType", "job")
  form.append("entityId", String(jobId))
  const response = await fergusCall("/attachments", {
    method: "POST",
    body: form,
  })
  fergusCheck(response, "photo upload")
}

export async function fergusSetHold(jobId: number, hold: boolean, reason = "") {
  if (fergusIsMock()) {
    const job = mockJobs()[jobId]
    if (job) job.onHold = hold
    return
  }
  const response = await fergusCall(
    `/jobs/${jobId}/${hold ? "hold" : "resume"}`,
    { method: "POST", body: hold && reason ? { notes: reason } : {} },
  )
  fergusCheck(response, hold ? "hold" : "resume")
}

// Work complete on a phase: Fergus's "ready for invoice" (the office then invoices it).
export async function fergusCompletePhase(jobId: number, phaseId: number) {
  if (fergusIsMock()) {
    const phase = mockJobs()[jobId]?.phases.find((p) => p.id === phaseId)
    if (phase) phase.status = "To Invoice"
    return
  }
  const response = await fergusCall(
    `/jobs/${jobId}/phases/${phaseId}/readyForInvoice`,
    { method: "POST" },
  )
  fergusCheck(response, "complete phase")
}

// The Fergus user with this email (staff sign-in), or undefined.
export async function fergusUserByEmail(email: string) {
  if (fergusIsMock()) {
    const name = email.split(/[@.]/)[0]!
    return { id: 1, firstName: name.charAt(0).toUpperCase() + name.slice(1) }
  }
  const found = await fergusCall<{
    data: { id: number; firstName?: string; email?: string; status?: string }[]
  }>("/users", { query: { filterSearchText: email, pageSize: "10" } })
  fergusCheck(found, "user search")
  const user = found._data?.data.find(
    (u) => u.email?.toLowerCase() === email.toLowerCase(),
  )
  return user && { id: user.id, firstName: user.firstName?.trim() || email }
}

// --- Pretend workshop (NUXT_FERGUS_MOCK=true) ----------------------------------------------
// Jobs 1001–1005, each at a different stage, for test@example.com or 01269 000000. In the
// staff app they're today's diary for whoever signs in.

const ago = (hours: number) => new Date(Date.now() - hours * 36e5).toISOString()
const mockSamplePhotos: Record<string, string> = {
  m1: "/images/rams.jpg",
  m2: "/images/hoses.jpg",
  m3: "/images/systems.jpg",
}
// Photos taken in the staff app in mock mode, served by /api/staff/mock-photo/<id>.
export const mockPhotoFiles = new Map<string, { data: Buffer; type: string }>()

let mockStore: Record<number, FergusJob> | undefined
function mockJobs() {
  if (mockStore) return mockStore
  const job = (
    id: number,
    status: string,
    phase: string,
    details: Partial<FergusJob>,
  ): FergusJob => ({
    id,
    jobNo: String(id),
    title: "",
    description: "",
    status,
    onHold: false,
    updated: ago(1),
    customer: "",
    contact: {
      name: "Test Customer",
      emails: ["test@example.com"],
      phones: ["01269 000000"],
    },
    site: { name: "CHS workshop (Cross Hands)", lines: ["Cross Hands"] },
    phases: [{ id: id * 10, title: "Repair", status: phase }],
    notes: [],
    photos: [],
    ...details,
  })
  const workshopNotes: JobNote[] = [
    {
      id: "n1",
      text: "Ram stripped down: the seals are worn and the rod is scored.",
      at: ago(26),
      by: "Rhys",
      shared: true,
    },
    {
      id: "n2",
      text: "Customer wants it back by Friday. Quote approved by phone.",
      at: ago(20),
      by: "Rhys",
      shared: false,
    },
    {
      id: "n3",
      text: "New seal kit fitted and the rod polished.",
      at: ago(4),
      by: "Rhys",
      shared: true,
    },
  ]
  mockStore = {
    1001: job(1001, "Active", "To Start", {
      title: "Hose made up: JCB 3CX bucket ram",
      customer: "Evans Plant Hire",
      description: "Burst hose on the bucket ram. Old hose brought in.",
    }),
    1002: job(1002, "Quote Sent", "To Schedule", {
      title: "Pre-season check: Massey Ferguson 6713",
      customer: "Tŷ Gwyn Farm",
      site: {
        name: "Tŷ Gwyn Farm",
        lines: ["Heol y Felin", "Llandeilo", "SA19 6AA"],
      },
    }),
    1003: job(1003, "Active", "In Progress", {
      title: "Ram rebuild: Kubota KX080 boom ram",
      customer: "Jones Groundworks",
      description: "Leaking boom ram, rod scored. Customer dropped it off.",
      notes: workshopNotes,
      photos: [{ id: "m1", at: ago(26), by: "Rhys", shared: true }],
    }),
    1004: job(1004, "Active", "In Progress", {
      title: "Fault finding: Bobcat S650 loader",
      customer: "Davies Construction",
      onHold: true,
      notes: [
        {
          id: "n4",
          text: "Waiting on a replacement gland nut from the supplier, due Thursday.",
          at: ago(3),
          by: "Gareth",
          shared: true,
        },
      ],
    }),
    1005: job(1005, "Active", "Labour Complete", {
      title: "Ram rebuild: tipper trailer ram",
      customer: "Williams Haulage",
      notes: [
        ...workshopNotes,
        {
          id: "n5",
          text: "Pressure tested to 250 bar: no leaks. Ready to collect.",
          at: ago(1),
          by: "Gareth",
          shared: true,
        },
      ],
      photos: [
        { id: "m3", at: ago(1), by: "Gareth", shared: true },
        { id: "m2", at: ago(4), by: "Rhys", shared: true },
        { id: "m1", at: ago(26), by: "Rhys", shared: false },
      ],
    }),
  }
  return mockStore
}

// Newest first, as readJob returns real ones.
const mockSorted = (job?: FergusJob) =>
  job && {
    ...job,
    notes: job.notes.toSorted((a, b) => b.at.localeCompare(a.at)),
    photos: job.photos.toSorted((a, b) => b.at.localeCompare(a.at)),
  }

function mockDiary(day: string): DiaryEntry[] {
  const at = (time: string) =>
    dayjs.tz(`${day} ${time}`, "Europe/London").toISOString()
  const jobs = mockJobs()
  const entry = (id: number, from: string, to: string): DiaryEntry => {
    const job = jobs[id]!
    return {
      start: at(from),
      end: at(to),
      allDay: false,
      title: job.title,
      jobId: id,
      jobNo: job.jobNo,
      customer: job.customer,
      site: [job.site.name].filter(Boolean).join(", "),
      status: job.status,
      onHold: job.onHold,
    }
  }
  return [
    entry(1003, "08:30", "11:30"),
    entry(1001, "11:30", "12:30"),
    entry(1004, "13:00", "15:00"),
    entry(1002, "15:30", "17:00"),
  ]
}
