import * as z from "zod"

// Opening hours and holiday closures as fetched from Sanity (one document, id
// "openingHours"; studio/schemas/openingHours.ts). Checked at build time by modules/hours.ts,
// so zod never reaches the browser. Kept free of Nuxt/Vite imports.

// Sanity returns null for empty fields, and the studio can save "", so both count as missing.
const empty = (value: unknown) =>
  value === "" || value === null ? undefined : value
const optional = <T extends z.ZodType>(schema: T) =>
  z.preprocess(empty, schema.optional())

const time = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/)

const day = z
  .object({
    closed: z.preprocess(empty, z.boolean().default(false)),
    open: optional(time),
    close: optional(time),
  })
  .refine((d) => d.closed || (d.open && d.close && d.open < d.close), {
    message: "needs an opening time before the closing time, or Closed",
  })

export const weekDays = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const

const closure = z
  .object({
    from: z.iso.date(),
    // Optional: a one-day closure.
    to: optional(z.iso.date()),
    reason: z.object({
      en: z.string().trim().min(1),
      cy: optional(z.string().trim().min(1)),
    }),
  })
  .transform(({ to, ...c }) => ({ ...c, to: to ?? c.from }))
  .refine((c) => c.from <= c.to, { message: "ends before it starts" })

export const openingHoursInputSchema = z.object({
  monday: day,
  tuesday: day,
  wednesday: day,
  thursday: day,
  friday: day,
  saturday: day,
  sunday: day,
  closures: z.preprocess((v) => empty(v) ?? [], z.array(closure)),
})

export type Closure = z.output<typeof closure>

// The week as schema.org opening hours ("Mo-Fr 08:00-17:30"), merging days in a row with the
// same times.
export function toOpeningHours(
  week: Record<(typeof weekDays)[number], z.output<typeof day>>,
) {
  const codes = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"]
  const specs: string[] = []
  let start = 0
  weekDays.forEach((name, i) => {
    const d = week[name]
    const next = week[weekDays[i + 1]!]
    const same =
      next &&
      !d.closed &&
      !next.closed &&
      d.open === next.open &&
      d.close === next.close
    if (same) return
    if (!d.closed)
      specs.push(
        `${codes[start]}${start === i ? "" : `-${codes[i]}`} ${d.open}-${d.close}`,
      )
    start = i + 1
  })
  return specs
}
