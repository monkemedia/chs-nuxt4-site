// Online booking: the rules and the slot calculation, shared by the booking API
// (server/api/booking) and the /book page. Pure functions over plain data, so they can be
// tested without Fergus.
//
// CHECK WITH CHS: every number below is a starting value. Replace them with the answers from
// the "Online Booking: Rules Worksheet" in Notion before switching live booking on.

import dayjs, { type Dayjs } from "dayjs/esm"
import timezone from "dayjs/esm/plugin/timezone"
import utc from "dayjs/esm/plugin/utc"

// shared/ can't use the app's auto-imported dayjs (app/utils/date.ts), so set up UK time here.
dayjs.extend(utc)
dayjs.extend(timezone)
const ukTime = "Europe/London"

export type BookingService = "hose" | "check" | "dropoff" | "onsite"

interface SlotService {
  kind: "slot"
  // How long the job blocks a bay, plus a gap after it.
  minutes: number
  bufferMinutes: number
  // Online bookings of this service per day, at most.
  maxPerDay: number
}
interface WindowService {
  kind: "window"
  // Drop-off windows ("HH:mm"): the customer arrives some time inside one. A ram's repair time
  // isn't known until it's stripped, so these cap arrivals per day instead of timing the job,
  // and don't take up a bay.
  windows: { start: string; end: string }[]
  maxPerDay: number
}

export const bookingRules = {
  // Jobs online bookings may run at the same time (bays or mechanics). Anything already in the
  // Fergus calendar counts against it, so breakdowns booked by phone are respected.
  capacity: 1,
  // Earliest booking: this many hours from now. Latest: this many days ahead.
  minNoticeHours: 18,
  daysAhead: 28,
  // Slot start times are on this grid (minutes past opening).
  stepMinutes: 30,
  services: {
    hose: { kind: "slot", minutes: 30, bufferMinutes: 10, maxPerDay: 6 },
    check: { kind: "slot", minutes: 60, bufferMinutes: 15, maxPerDay: 3 },
    // On-site visit: only bookable while app.config `features.onsite` is on (the page hides it and
    // the API refuses it otherwise). The buffer covers travel there and back.
    onsite: { kind: "slot", minutes: 120, bufferMinutes: 60, maxPerDay: 2 },
    dropoff: {
      kind: "window",
      windows: [{ start: "08:30", end: "10:00" }],
      maxPerDay: 3,
    },
  } satisfies Record<BookingService, SlotService | WindowService>,
}

export const bookingServices = Object.keys(
  bookingRules.services,
) as BookingService[]

// The services bookable right now: on-site only once on-site work is live.
export const availableBookingServices = (onsite: boolean) =>
  bookingServices.filter((service) => onsite || service !== "onsite")

// The booking each service page links to (/book?service=…).
export const bookingServiceForPage: Record<string, BookingService> = {
  "hydraulic-hoses": "hose",
  "ram-repairs": "dropoff",
  "hydraulic-system-repairs": "dropoff",
  "on-site-hydraulic-service": "onsite",
}

// Calendar events written by the website start with this, so later bookings can count them.
export const webBookingPrefix = "Web booking:"
export const webBookingTitle = (service: BookingService, name: string) =>
  `${webBookingPrefix} ${service} · ${name}`

export interface BusyEvent {
  // ISO date-times.
  start: string
  end: string
  allDay: boolean
  title: string
}

export interface Slot {
  // ISO date-time with the UK offset, e.g. 2026-10-12T09:30:00+01:00.
  start: string
  end: string
}

export interface DaySlots {
  // YYYY-MM-DD (UK).
  date: string
  slots: Slot[]
}

interface Hours {
  // One { open, close } (minutes after midnight) per weekday, Monday first; null = closed.
  week: ({ open: number; close: number } | null)[]
  // Holiday closures, YYYY-MM-DD inclusive.
  closures: { from: string; to: string }[]
}

const minutesOf = (time: string) => {
  const [h, m] = time.split(":").map(Number)
  return h! * 60 + m!
}

// Free slots for a service from `now` up to `bookingRules.daysAhead` days ahead, in UK time.
// `events` is everything in the Fergus calendar over that period.
export function computeSlots(
  service: BookingService,
  events: BusyEvent[],
  hours: Hours,
  now: Dayjs,
): DaySlots[] {
  const rule = bookingRules.services[service]
  const earliest = now.add(bookingRules.minNoticeHours, "hour")
  const days: DaySlots[] = []

  for (let d = 0; d <= bookingRules.daysAhead; d++) {
    const day = now.tz(ukTime).startOf("day").add(d, "day")
    const date = day.format("YYYY-MM-DD")
    const open = hours.week[(day.day() + 6) % 7]
    if (!open || hours.closures.some((c) => date >= c.from && date <= c.to))
      continue

    // This day's events, as minutes after midnight (UK).
    const dayEvents = events
      .map((e) => {
        if (e.allDay) {
          const start = dayjs(e.start).tz(ukTime).format("YYYY-MM-DD")
          const end = dayjs(e.end).tz(ukTime).format("YYYY-MM-DD")
          return date >= start && date <= end
            ? { from: 0, to: 24 * 60, title: e.title }
            : null
        }
        const from = dayjs(e.start).tz(ukTime)
        const to = dayjs(e.end).tz(ukTime)
        if (to.isBefore(day) || !from.isBefore(day.add(1, "day"))) return null
        return {
          from: Math.max(0, from.diff(day, "minute")),
          to: Math.min(24 * 60, to.diff(day, "minute")),
          title: e.title,
        }
      })
      .filter((e) => e !== null)

    const booked = dayEvents.filter((e) =>
      e.title.startsWith(`${webBookingPrefix} ${service} `),
    ).length
    if (booked >= rule.maxPerDay) continue

    const slots: Slot[] = []
    const at = (minutes: number) => day.add(minutes, "minute")
    if (rule.kind === "window") {
      for (const w of rule.windows) {
        const from = minutesOf(w.start)
        const to = minutesOf(w.end)
        if (from < open.open || to > open.close || at(from).isBefore(earliest))
          continue
        slots.push({ start: at(from).format(), end: at(to).format() })
      }
    } else {
      // Drop-off windows don't occupy a bay, so they don't count against capacity.
      const occupying = dayEvents.filter(
        (e) => !e.title.startsWith(`${webBookingPrefix} dropoff `),
      )
      const length = rule.minutes + rule.bufferMinutes
      for (
        let start = open.open;
        start + rule.minutes <= open.close;
        start += bookingRules.stepMinutes
      ) {
        if (at(start).isBefore(earliest)) continue
        const end = Math.min(start + length, open.close)
        // Busiest moment inside the slot: events overlapping at each event start or slot start.
        const points = [
          start,
          ...occupying.map((e) => e.from).filter((p) => p > start && p < end),
        ]
        const peak = Math.max(
          ...points.map(
            (p) => occupying.filter((e) => e.from <= p && e.to > p).length,
          ),
        )
        if (peak < bookingRules.capacity)
          slots.push({
            start: at(start).format(),
            end: at(start + rule.minutes).format(),
          })
      }
    }
    if (slots.length) days.push({ date, slots })
  }
  return days
}
