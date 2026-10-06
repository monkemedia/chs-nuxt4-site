import dayjs from "dayjs/esm"
import type { BusyEvent } from "#shared/utils/booking"

// Minimal Fergus Open API client for the booking API (https://api.fergus.com/docs). The token
// (NUXT_FERGUS_API_TOKEN) is a secret: it only exists on the server. With NUXT_FERGUS_MOCK=true
// (dev, or a preview without a token) a pretend calendar is used instead, so the booking flow
// can be tried without touching Fergus.

const base = "https://api.fergus.com"

interface FergusCalendarEvent {
  id: number
  title: string
  startTime: string
  endTime: string
  isAllDay: boolean
  isActive: boolean
}

export interface NewBooking {
  service: string
  start: string
  end: string
  title: string
  name: string
  company?: string
  phone: string
  email: string
  description: string
  // On-site visits: where the machine is (becomes the job's site). Workshop jobs use the
  // workshop as their site.
  location?: string
}

async function call<T>(
  path: string,
  init: {
    method?: string
    body?: unknown
    query?: Record<string, string>
  } = {},
) {
  const runtimeConfig = useRuntimeConfig()
  return await $fetch.raw<T>(`${base}${path}`, {
    method: (init.method ?? "GET") as "GET",
    query: init.query,
    body: init.body as Record<string, unknown>,
    headers: { Authorization: `Bearer ${runtimeConfig.fergusApiToken}` },
    // 303 (customer already exists) is handled by the caller.
    ignoreResponseError: true,
  })
}

function check(response: { status: number; _data?: unknown }, what: string) {
  if (response.status >= 400)
    throw createError({
      statusCode: 502,
      statusMessage: `Fergus ${what} failed (${response.status})`,
    })
}

// Pretend calendar: a busy morning tomorrow and a full day the day after, so the slot picker
// has something to avoid. Bookings made in mock mode are kept in memory until restart.
const mockEvents: BusyEvent[] = []
function mockCalendar(): BusyEvent[] {
  const day = (n: number, time: string) =>
    new Date(Date.now() + n * 864e5).toISOString().slice(0, 10) +
    `T${time}:00+01:00`
  return [
    {
      start: day(1, "08:30"),
      end: day(1, "11:30"),
      allDay: false,
      title: "Ram rebuild (mock)",
    },
    {
      start: day(2, "08:30"),
      end: day(2, "17:00"),
      allDay: false,
      title: "Site job (mock)",
    },
    ...mockEvents,
  ]
}

const isMock = () => {
  const runtimeConfig = useRuntimeConfig()
  return !runtimeConfig.fergusApiToken && runtimeConfig.fergusMock
}

// Everything in the Fergus calendar from `from` (YYYY-MM-DD) for about five weeks.
export async function fergusBusyEvents(from: string): Promise<BusyEvent[]> {
  if (isMock()) return mockCalendar()
  // Two FORTNIGHT ranges plus a WEEK cover the booking horizon (28 days) from any weekday.
  const starts = [0, 14, 28].map((d) =>
    dayjs(from).add(d, "day").format("YYYY-MM-DD"),
  )
  const ranges = ["FORTNIGHT", "FORTNIGHT", "WEEK"]
  const events = new Map<number, FergusCalendarEvent>()
  for (const [i, start] of starts.entries()) {
    const response = await call<{ data: FergusCalendarEvent[] }>(
      "/calendarEvents",
      {
        query: {
          filterDateFrom: `${start}T00:00:00+00:00`,
          filterCalendarRange: ranges[i]!,
          filterActiveOnly: "true",
        },
      },
    )
    check(response, "calendar")
    for (const e of response._data?.data ?? []) events.set(e.id, e)
  }
  return [...events.values()].map((e) => ({
    start: e.startTime,
    end: e.endTime,
    allDay: e.isAllDay,
    title: e.title ?? "",
  }))
}

interface NewSite {
  name: string
  defaultContact: Record<string, unknown>
  siteAddress: Record<string, string | undefined>
}

// Creates a site and returns its id (303: Fergus says it exists already, and where).
async function createSite(site: NewSite) {
  const created = await call<{ data?: { id: number }; location?: string }>(
    "/sites",
    { method: "POST", body: site },
  )
  const id =
    created._data?.data?.id ??
    Number(created._data?.location?.split("/").pop() || NaN)
  if (created.status >= 400 || !id) check(created, "new site")
  return id
}

// The workshop, as the site for every workshop job: found by name, or created the first time.
const workshopSiteName = "CHS workshop (Cross Hands)"
let workshopSite: number | undefined
async function workshopSiteId() {
  if (workshopSite) return workshopSite
  const found = await call<{ data: { id: number; name?: string }[] }>(
    "/sites",
    { query: { filterSiteName: workshopSiteName, pageSize: "5" } },
  )
  workshopSite = found._data?.data?.find((s) => s.name === workshopSiteName)?.id
  if (!workshopSite) {
    const { business } = useAppConfig()
    const { address } = business
    workshopSite = await createSite({
      name: workshopSiteName,
      defaultContact: {
        firstName: "CHS",
        lastName: "Workshop",
        company: business.name,
      },
      siteAddress: {
        address1: address.street,
        addressSuburb: address.locality,
        addressCity: address.town,
        addressRegion: address.region,
        addressPostcode: address.postcode,
        addressCountry: "United Kingdom",
      },
    })
  }
  return workshopSite
}

// Finds the customer by email (or creates them), then adds an active job at the right site and
// the calendar event linked to it.
export async function fergusCreateBooking(booking: NewBooking) {
  if (isMock()) {
    mockEvents.push({
      start: booking.start,
      end: booking.end,
      allDay: false,
      title: booking.title,
    })
    return { jobId: 0, jobNo: undefined, mock: true }
  }
  const runtimeConfig = useRuntimeConfig()

  let customerId: number | undefined
  const found = await call<{
    data: {
      id: number
      mainContact?: { contactItems?: { contactValue?: string }[] }
    }[]
  }>("/customers", {
    query: { filterSearchText: booking.email, pageSize: "10" },
  })
  check(found, "customer search")
  customerId = found._data?.data.find((c) =>
    c.mainContact?.contactItems?.some(
      (item) =>
        item.contactValue?.toLowerCase() === booking.email.toLowerCase(),
    ),
  )?.id

  if (!customerId) {
    const [firstName, ...rest] = booking.name.split(" ")
    const created = await call<{
      data?: { id: number }
      location?: string
    }>("/customers", {
      method: "POST",
      body: {
        customerFullName: booking.company || booking.name,
        mainContact: {
          firstName,
          lastName: rest.join(" ") || undefined,
          company: booking.company || undefined,
          contactItems: [
            { contactType: "email", contactValue: booking.email },
            { contactType: "phone", contactValue: booking.phone },
          ],
        },
      },
    })
    // 303: Fergus says the customer already exists and where.
    customerId =
      created._data?.data?.id ??
      (Number(created._data?.location?.split("/").pop()) || undefined)
    if (created.status >= 400 || !customerId) check(created, "new customer")
  }

  const [firstName, ...rest] = booking.name.split(" ")
  const siteId = booking.location
    ? await createSite({
        name: `${booking.company || booking.name} – ${booking.location}`.slice(
          0,
          100,
        ),
        defaultContact: {
          firstName,
          lastName: rest.join(" ") || undefined,
          company: booking.company || undefined,
          contactItems: [
            { contactType: "email", contactValue: booking.email },
            { contactType: "phone", contactValue: booking.phone },
          ],
        },
        siteAddress: { address1: booking.location },
      })
    : await workshopSiteId()

  // An active job, so it's on the dashboard and job list straight away (Fergus needs the
  // customer, site and description for that). If Fergus refuses, fall back to a draft rather
  // than lose the booking.
  const jobBody = {
    jobType: runtimeConfig.fergusJobType || "Charge Up",
    title: booking.title,
    description: booking.description,
    customerId,
  }
  let job = await call<{ data: { id: number; jobNo?: string } }>("/jobs", {
    method: "POST",
    body: { ...jobBody, isDraft: false, siteId },
  })
  if (job.status >= 400) {
    console.error(
      `[booking] Fergus refused an active job (${job.status}), saving it as a draft:`,
      JSON.stringify(job._data),
    )
    job = await call("/jobs", {
      method: "POST",
      body: { ...jobBody, isDraft: true },
    })
  }
  check(job, "new job")
  const jobId = job._data!.data.id
  const jobNo = job._data!.data.jobNo

  // Calendar events are tied to a job through one of its phases; that makes the booking open
  // the job from the calendar.
  const phases = await call<{ data: { id: number }[] }>(`/jobs/${jobId}/phases`)
  const jobPhaseId = phases.status < 400 ? phases._data?.data[0]?.id : undefined

  const event = await call("/calendarEvents", {
    method: "POST",
    body: {
      startTime: booking.start,
      endTime: booking.end,
      eventTitle: booking.title,
      eventType: jobPhaseId ? "JOB_PHASE" : "OTHER",
      jobId,
      ...(jobPhaseId ? { jobPhaseId } : {}),
      description: booking.description,
      ...(runtimeConfig.fergusUserId
        ? { userId: Number(runtimeConfig.fergusUserId) }
        : {}),
    },
  })
  check(event, "calendar event")
  return { jobId, jobNo, mock: false }
}

// "Track my repair": a job by its number, with what's needed to check the visitor is its
// customer (the contact's email and phone numbers), its progress and what the workshop has
// shared. Undefined if there's no such live job.
//
// Fergus notes and photos are internal by default, so only some reach the customer: notes the
// mechanic pins, and photos whose file name starts with "customer" (Fergus files can't be
// pinned). Both are read from the job and each of its phases.
export const sharedPhotoPrefix = "customer"

export interface RepairJob {
  status: string
  onHold: boolean
  phases: string[]
  updated: string
  emails: string[]
  phones: string[]
  // `by`: the first name of the staff member who added it (Fergus user), when known.
  notes: { text: string; at: string; by?: string }[]
  photos: { id: string; at: string; by?: string }[]
}

interface FergusNote {
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

// Staff first names by Fergus user id, for "who did this" on the tracker. First names only:
// customers don't need staff surnames. Refreshed hourly; a failure just leaves names off.
let staff: { at: number; names: Map<number, string> } | undefined
async function staffNames() {
  if (staff && Date.now() - staff.at < 36e5) return staff.names
  const response = await call<{ data: { id: number; firstName?: string }[] }>(
    "/users",
    { query: { pageSize: "100" } },
  )
  const names = new Map<number, string>()
  if (response.status < 400)
    for (const user of response._data?.data ?? [])
      if (user.firstName?.trim()) names.set(user.id, user.firstName.trim())
  staff = { at: Date.now(), names }
  return names
}

// `updates` false (features.repairUpdates off) skips the notes, photos and staff names, and
// their Fergus calls.
export async function fergusRepairJob(
  jobNo: string,
  updates: boolean,
): Promise<RepairJob | undefined> {
  if (isMock()) {
    const job = mockRepairJobs[jobNo]
    return job && !updates ? { ...job, notes: [], photos: [] } : job
  }
  const found = await call<{
    data: {
      id: number
      jobNo?: string | number
      status: string
      onHold?: boolean
      archived?: boolean
      lastModified?: string
      createdAt: string
      mainContact?: {
        contactItems?: { contactType?: string; contactValue?: string }[]
      }
    }[]
  }>("/jobs", {
    query: { filterJobNo: jobNo, filterShowOnHold: "true", pageSize: "5" },
  })
  check(found, "job search")
  const job = found._data?.data.find(
    (j) => String(j.jobNo) === jobNo && !j.archived && j.status !== "Inactive",
  )
  if (!job) return undefined
  const phases = await call<{ data: { id: number; status?: string }[] }>(
    `/jobs/${job.id}/phases`,
  )
  check(phases, "job phases")
  const phaseList = phases._data?.data ?? []

  // The job and each phase can carry notes and photos. A failure here only loses the extras,
  // never the status.
  const entities = !updates
    ? []
    : [
        { note: "JOB", file: "job", id: job.id },
        ...phaseList.map((p) => ({
          note: "JOB_PHASE",
          file: "job_phase",
          id: p.id,
        })),
      ]
  const [notes, files, names] = await Promise.all([
    Promise.all(
      entities.map(async (e) => {
        const r = await call<{ data: FergusNote[] }>("/notes", {
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
        const r = await call<{ data: FergusFile[] }>("/attachments", {
          query: {
            entityType: e.file,
            entityId: String(e.id),
            pageSize: "50",
          },
        })
        return r.status < 400 ? (r._data?.data ?? []) : []
      }),
    ),
    updates ? staffNames() : new Map<number, string>(),
  ])
  const by = (id?: number | null) => (id ? names.get(id) : undefined)

  const items = job.mainContact?.contactItems ?? []
  return {
    status: job.status,
    onHold: !!job.onHold,
    phases: phaseList.map((p) => p.status ?? ""),
    updated: job.lastModified || job.createdAt,
    emails: items
      .filter((i) => i.contactType === "email")
      .map((i) => i.contactValue ?? ""),
    phones: items
      .filter((i) => i.contactType !== "email")
      .map((i) => i.contactValue ?? ""),
    notes: notes
      .flat()
      .filter((n) => n.isPinned && n.text?.trim())
      .map((n) => ({
        text: n.text!.trim(),
        at: n.createdAt,
        by: by(n.createdById),
      })),
    photos: files
      .flat()
      .filter(
        (f) =>
          f.mimeType?.startsWith("image/") &&
          f.fileName?.toLowerCase().startsWith(sharedPhotoPrefix),
      )
      .map((f) => ({ id: String(f.id), at: f.createdAt, by: by(f.createdBy) })),
  }
}

// Where a shared photo can be downloaded: Fergus answers with a redirect to a short-lived
// signed file URL, which the site passes on (the API token never reaches the browser).
export async function fergusPhotoUrl(id: string) {
  if (isMock()) return mockPhotos[id]
  const response = await $fetch.raw(`${base}/attachments/${id}/download`, {
    headers: {
      Authorization: `Bearer ${useRuntimeConfig().fergusApiToken}`,
    },
    redirect: "manual",
    ignoreResponseError: true,
  })
  return response.headers.get("location") ?? undefined
}

// Pretend jobs for trying the tracker (NUXT_FERGUS_MOCK=true): job numbers 1001–1005, each at a
// different stage, for test@example.com or 01269 000000. 1003–1005 have shared notes and photos.
const ago = (hours: number) => new Date(Date.now() - hours * 36e5).toISOString()
const mockPhotos: Record<string, string> = {
  m1: "/images/rams.jpg",
  m2: "/images/hoses.jpg",
  m3: "/images/systems.jpg",
}
const mockJob = (
  status: string,
  phases: string[],
  extras: Partial<RepairJob> = {},
): RepairJob => ({
  status,
  onHold: false,
  phases,
  updated: ago(1),
  emails: ["test@example.com"],
  phones: ["01269 000000"],
  notes: [],
  photos: [],
  ...extras,
})
const workshopNotes = [
  {
    text: "Ram stripped down: the seals are worn and the rod is scored.",
    at: ago(26),
    by: "Rhys",
  },
  { text: "New seal kit fitted and the rod polished.", at: ago(4), by: "Rhys" },
]
const mockRepairJobs: Record<string, RepairJob> = {
  "1001": mockJob("Active", ["To Start"]),
  "1002": mockJob("Quote Sent", []),
  "1003": mockJob("Active", ["In Progress"], {
    notes: workshopNotes,
    photos: [{ id: "m1", at: ago(26), by: "Rhys" }],
  }),
  "1004": mockJob("Active", ["In Progress"], {
    onHold: true,
    notes: [
      {
        text: "Waiting on a replacement gland nut from the supplier, due Thursday.",
        at: ago(3),
        by: "Gareth",
      },
    ],
  }),
  "1005": mockJob("Active", ["Labour Complete"], {
    notes: [
      ...workshopNotes,
      {
        text: "Pressure tested to 250 bar: no leaks. Ready to collect.",
        at: ago(1),
        by: "Gareth",
      },
    ],
    photos: [
      { id: "m1", at: ago(26), by: "Rhys" },
      { id: "m2", at: ago(4), by: "Rhys" },
      { id: "m3", at: ago(1), by: "Gareth" },
    ],
  }),
}
