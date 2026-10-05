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
      Number(created._data?.location?.split("/").pop()) ??
      undefined
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
