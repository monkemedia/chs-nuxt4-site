import * as z from "zod"

// Shape of a Recent work job as fetched from Sanity (modules/lib/sanity.ts, edited in the
// admin area: studio/schemas/job.ts). Checked at build time by modules/jobs.ts, so zod
// never reaches the browser. Kept free of Nuxt/Vite imports.

// Sanity returns null for empty fields, and the studio can save "", so both count as missing.
const empty = (value: unknown) =>
  value === "" || value === null ? undefined : value
const optional = <T extends z.ZodType>(schema: T) =>
  z.preprocess(empty, schema.optional())

const text = z.object({
  // Page heading and card title, e.g. "Boom ram rebuilt for a JCB 3CX".
  title: z.string().trim().min(1),
  // One or two sentences for the card, the page intro and the meta description.
  summary: z.string().trim().min(1),
  // Optional: left out of the page and card when empty.
  machine: optional(z.string().trim()),
  location: optional(z.string().trim()),
  problem: z.string().trim().min(1),
  work: z.array(z.string().trim().min(1)).min(1),
  result: z.string().trim().min(1),
  // Optional: the job title is used when it's empty.
  imageAlt: optional(z.string().trim()),
})

export const jobInputSchema = z.object({
  // Published content comes back with null here (no draft id), drafts with true.
  draft: z.preprocess(empty, z.boolean().default(false)),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  date: z.iso.date(),
  service: z.string(),
  // Optional: cards fall back to the service's image; the job page shows no photo.
  image: optional(z.string().trim()),
  en: text,
  // Optional: without a complete Welsh version the Welsh site shows the English.
  cy: z.unknown().optional(),
})

export type JobText = z.infer<typeof text>
export interface Job extends Omit<
  z.infer<typeof jobInputSchema>,
  "cy" | "draft"
> {
  // Null when there's no complete Welsh version.
  cy: JobText | null
  // Not published yet. Drafts only reach the preview build (NUXT_PUBLIC_SHOW_DRAFTS).
  draft?: true
}

// Invalid jobs are skipped with a reason, so a half-finished entry never breaks the build.
export function parseJob(data: unknown): { job: Job } | { skipped: string } {
  const parsed = jobInputSchema.safeParse(data)
  const label = (data as { slug?: string } | null)?.slug ?? "(no web address)"
  if (!parsed.success)
    return { skipped: `${label}: ${z.prettifyError(parsed.error)}` }
  const { draft, cy, ...job } = parsed.data
  const welsh = text.safeParse(cy)
  return {
    job: {
      ...job,
      cy: welsh.success ? welsh.data : null,
      ...(draft ? { draft: true as const } : {}),
    },
  }
}
