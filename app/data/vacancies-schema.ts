import * as z from "zod"

// Shape of a vacancy as fetched from Sanity (modules/lib/sanity.ts, edited in the admin
// area: studio/schemas/vacancy.ts). Checked at build time by modules/vacancies.ts, so zod
// never reaches the browser. Kept free of Nuxt/Vite imports.

// Sanity returns null for empty fields, and the studio can save "", so both count as missing.
const empty = (value: unknown) =>
  value === "" || value === null ? undefined : value
const optional = <T extends z.ZodType>(schema: T) =>
  z.preprocess(empty, schema.optional())
const list = z.preprocess(
  (value) => empty(value) ?? [],
  z.array(z.string().trim().min(1)),
)

const text = z.object({
  // Page heading and card title, e.g. "Hydraulic fitter".
  title: z.string().trim().min(1),
  // One or two sentences for the card, the page intro and the meta description.
  summary: z.string().trim().min(1),
  // Optional, e.g. "Monday to Friday, 8am to 5pm".
  hours: optional(z.string().trim()),
  about: z.string().trim().min(1),
  responsibilities: z.array(z.string().trim().min(1)).min(1),
  requirements: z.array(z.string().trim().min(1)).min(1),
  // Optional: left out of the page when empty.
  niceToHave: list,
  offer: list,
})

export const employmentTypes = [
  "full-time",
  "part-time",
  "apprenticeship",
  "temporary",
] as const

export const vacancyInputSchema = z.object({
  draft: z.boolean().default(false),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  posted: z.iso.date(),
  // Optional: without one, the vacancy stays up until it's unpublished.
  closes: optional(z.iso.date()),
  type: z.enum(employmentTypes),
  // Optional: pounds, per `salaryPeriod`. A single figure goes in salaryMin.
  salaryMin: optional(z.number().positive()),
  salaryMax: optional(z.number().positive()),
  salaryPeriod: z.preprocess(empty, z.enum(["year", "hour"]).default("year")),
  en: text,
  // Optional: without a complete Welsh version the Welsh site shows the English.
  cy: z.unknown().optional(),
})

export type EmploymentType = (typeof employmentTypes)[number]
export type VacancyText = z.infer<typeof text>
export interface Vacancy extends Omit<
  z.infer<typeof vacancyInputSchema>,
  "cy" | "draft"
> {
  // Null when there's no complete Welsh version.
  cy: VacancyText | null
  // Not published yet (or an example). Only reaches dev and the preview build.
  draft?: true
}

// Invalid vacancies are skipped with a reason, so a half-finished entry never breaks the build.
export function parseVacancy(
  data: unknown,
): { vacancy: Vacancy } | { skipped: string } {
  const parsed = vacancyInputSchema.safeParse(data)
  const label = (data as { slug?: string } | null)?.slug ?? "(no web address)"
  if (!parsed.success)
    return { skipped: `${label}: ${z.prettifyError(parsed.error)}` }
  const { draft, cy, ...vacancy } = parsed.data
  const welsh = text.safeParse(cy)
  return {
    vacancy: {
      ...vacancy,
      cy: welsh.success ? welsh.data : null,
      ...(draft ? { draft: true as const } : {}),
    },
  }
}
