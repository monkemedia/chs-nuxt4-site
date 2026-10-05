// app.config `openingHours` (schema.org format, e.g. "Mo-Fr 08:00-17:30") is the one source
// for opening times: the contact page list, the live open/closed line and structured data.

const days = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"]

export interface OpeningPeriod {
  // Days, Monday = 0.
  from: number
  to: number
  // Minutes after midnight.
  open: number
  close: number
}

export function parseOpeningHours(specs: readonly string[]): OpeningPeriod[] {
  const minutes = (time: string) => {
    const [h, m] = time.split(":").map(Number)
    return h! * 60 + m!
  }
  return specs.map((spec) => {
    const [dayPart, timePart] = spec.split(" ")
    const [from, to = from] = dayPart!.split("-")
    const [open, close] = timePart!.split("-")
    return {
      from: days.indexOf(from!),
      to: days.indexOf(to!),
      open: minutes(open!),
      close: minutes(close!),
    }
  })
}

// 480 -> "8am", 1050 -> "5.30pm" (UK style), with the language's am/pm words.
export function formatHour(
  minutes: number,
  { am, pm }: { am: string; pm: string },
) {
  const hour = Math.floor(minutes / 60)
  const minute = minutes % 60
  const clock = `${hour % 12 || 12}${minute ? `.${String(minute).padStart(2, "0")}` : ""}`
  return `${clock}${hour < 12 ? am : pm}`
}
