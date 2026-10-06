import { describe, expect, it } from "vitest"
import { buildIcs, googleCalendarUrl } from "#shared/utils/ics"

const event = {
  uid: "booking-1@chshydraulics.co.uk",
  title: "Hose made up, CHS Hydraulics",
  start: "2026-10-13T09:30:00+01:00",
  end: "2026-10-13T10:00:00+01:00",
  location: "3 Acer Court, Cross Hands, Llanelli SA14 6RB",
  description:
    "Bring the old hose.\nQuestions? Call 01269 831491; we're happy to help.",
}

describe("buildIcs", () => {
  const ics = buildIcs(event, new Date("2026-10-12T12:00:00Z"))
  const lines = ics.split("\r\n")

  it("writes times in UTC", () => {
    expect(lines).toContain("DTSTART:20261013T083000Z")
    expect(lines).toContain("DTEND:20261013T090000Z")
    expect(lines).toContain("DTSTAMP:20261012T120000Z")
  })

  it("escapes commas, semicolons and line breaks", () => {
    expect(ics).toContain("SUMMARY:Hose made up\\, CHS Hydraulics")
    expect(ics.replace(/\r\n /g, "")).toContain(
      "DESCRIPTION:Bring the old hose.\\nQuestions? Call 01269 831491\\; we're happy to help.",
    )
  })

  it("folds long lines and uses CRLF", () => {
    for (const line of lines) expect(line.length).toBeLessThanOrEqual(75)
    expect(ics).not.toMatch(/[^\r]\n/)
    expect(lines[0]).toBe("BEGIN:VCALENDAR")
    expect(lines.at(-1)).toBe("END:VCALENDAR")
  })
})

describe("googleCalendarUrl", () => {
  it("links to a prefilled Google Calendar event", () => {
    const url = new URL(googleCalendarUrl(event))
    expect(url.hostname).toBe("calendar.google.com")
    expect(url.searchParams.get("text")).toBe(event.title)
    expect(url.searchParams.get("dates")).toBe(
      "20261013T083000Z/20261013T090000Z",
    )
  })
})
