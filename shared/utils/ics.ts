// Calendar invites for bookings: an .ics file (iPhone, Outlook and most apps) and a Google
// Calendar link. Shared by the booking confirmation (download) and the confirmation email
// (attachment). Times are written in UTC, which every calendar converts to local time.

export interface CalendarEvent {
  // Stable id, so re-adding the same booking updates rather than duplicates it.
  uid: string
  title: string
  // ISO date-times.
  start: string
  end: string
  location: string
  description: string
}

const utcStamp = (iso: string) =>
  new Date(iso)
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}/, "")

// Escape text for .ics: backslash, semicolon, comma and line breaks.
const escape = (text: string) =>
  text
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n")

// Lines longer than 75 octets are folded (RFC 5545); a continuation starts with a space.
const fold = (line: string) =>
  line.length <= 74 ? line : (line.match(/.{1,74}/g) ?? [line]).join("\r\n ")

export function buildIcs(event: CalendarEvent, now = new Date()) {
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//CHS Hydraulics//Bookings//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${event.uid}`,
    `DTSTAMP:${utcStamp(now.toISOString())}`,
    `DTSTART:${utcStamp(event.start)}`,
    `DTEND:${utcStamp(event.end)}`,
    `SUMMARY:${escape(event.title)}`,
    `LOCATION:${escape(event.location)}`,
    `DESCRIPTION:${escape(event.description)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ]
    .map(fold)
    .join("\r\n")
}

export function googleCalendarUrl(event: CalendarEvent) {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates: `${utcStamp(event.start)}/${utcStamp(event.end)}`,
    location: event.location,
    details: event.description,
  })
  return `https://calendar.google.com/calendar/render?${params}`
}
