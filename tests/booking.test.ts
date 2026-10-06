import dayjs from "dayjs/esm"
import { describe, expect, it } from "vitest"
import {
  bookingRules,
  computeSlots,
  webBookingTitle,
  type BusyEvent,
} from "#shared/utils/booking"

// Mon–Fri 08:00–17:30, closed at weekends.
const weekday = { open: 8 * 60, close: 17 * 60 + 30 }
const hours = {
  week: [weekday, weekday, weekday, weekday, weekday, null, null],
  closures: [] as { from: string; to: string }[],
}
// Monday 12 October 2026, 08:00 UK (BST, +01:00).
const now = dayjs("2026-10-12T08:00:00+01:00")
const day = (date: string, days: ReturnType<typeof computeSlots>) =>
  days.find((d) => d.date === date)?.slots ?? []
const times = (slots: { start: string }[]) =>
  slots.map((s) => s.start.slice(11, 16))

describe("computeSlots", () => {
  it("respects the minimum notice", () => {
    const days = computeSlots("hose", [], hours, now)
    // 18 hours from Monday 08:00 is Tuesday 02:00, so Monday has nothing.
    expect(day("2026-10-12", days)).toEqual([])
    expect(times(day("2026-10-13", days))[0]).toBe("08:00")
  })

  it("skips closed days and holiday closures", () => {
    const days = computeSlots(
      "hose",
      [],
      { ...hours, closures: [{ from: "2026-10-14", to: "2026-10-15" }] },
      now,
    )
    const dates = days.map((d) => d.date)
    expect(dates).not.toContain("2026-10-17") // Saturday
    expect(dates).not.toContain("2026-10-18") // Sunday
    expect(dates).not.toContain("2026-10-14")
    expect(dates).not.toContain("2026-10-15")
    expect(dates).toContain("2026-10-16")
  })

  it("keeps slots inside opening hours, on the step grid", () => {
    const slots = day("2026-10-13", computeSlots("check", [], hours, now))
    expect(times(slots).at(-1)).toBe("16:30") // a 60-minute check must end by 17:30
    for (const t of times(slots))
      expect(Number(t.slice(3)) % bookingRules.stepMinutes).toBe(0)
  })

  it("avoids anything already in the diary", () => {
    const busy: BusyEvent[] = [
      {
        start: "2026-10-13T09:00:00+01:00",
        end: "2026-10-13T11:00:00+01:00",
        allDay: false,
        title: "Breakdown",
      },
    ]
    const slots = times(
      day("2026-10-13", computeSlots("hose", busy, hours, now)),
    )
    expect(slots).toContain("08:00")
    // 08:30 + 30 min + 10 min buffer runs into 09:00.
    expect(slots).not.toContain("08:30")
    expect(slots).not.toContain("10:00")
    expect(slots).toContain("11:00")
  })

  it("closes a whole day for an all-day event", () => {
    const busy: BusyEvent[] = [
      {
        start: "2026-10-13",
        end: "2026-10-13",
        allDay: true,
        title: "Training",
      },
    ]
    expect(day("2026-10-13", computeSlots("hose", busy, hours, now))).toEqual(
      [],
    )
  })

  it("stops taking bookings once the daily limit is reached", () => {
    const max = bookingRules.services.check.maxPerDay
    const busy: BusyEvent[] = Array.from({ length: max }, (_, i) => ({
      // Booked late, so they don't block the morning by overlapping it.
      start: `2026-10-13T1${4 + i}:00:00+01:00`,
      end: `2026-10-13T1${4 + i}:00:00+01:00`,
      allDay: false,
      title: webBookingTitle("check", `Customer ${i}`),
    }))
    expect(day("2026-10-13", computeSlots("check", busy, hours, now))).toEqual(
      [],
    )
  })

  it("offers drop-off windows that don't take a bay", () => {
    const busy: BusyEvent[] = [
      {
        start: "2026-10-13T08:00:00+01:00",
        end: "2026-10-13T17:30:00+01:00",
        allDay: false,
        title: "Ram rebuild",
      },
    ]
    const slots = day("2026-10-13", computeSlots("dropoff", busy, hours, now))
    expect(slots).toEqual([
      {
        start: "2026-10-13T08:30:00+01:00",
        end: "2026-10-13T10:00:00+01:00",
      },
    ])
  })

  it("uses UK time across the clocks going back", () => {
    // Clocks go back on Sunday 25 October 2026: Monday 26th is GMT (+00:00).
    const slots = day("2026-10-26", computeSlots("hose", [], hours, now))
    expect(new Date(slots[0]!.start).toISOString()).toBe(
      "2026-10-26T08:00:00.000Z",
    )
    // And still 08:00 in summer time the week before.
    const before = day("2026-10-19", computeSlots("hose", [], hours, now))
    expect(new Date(before[0]!.start).toISOString()).toBe(
      "2026-10-19T07:00:00.000Z",
    )
  })

  it("only looks the configured number of days ahead", () => {
    const days = computeSlots("hose", [], hours, now)
    const last = dayjs(days.at(-1)!.date)
    expect(last.diff(dayjs("2026-10-12"), "day")).toBeLessThanOrEqual(
      bookingRules.daysAhead,
    )
  })
})
