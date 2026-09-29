import * as z from "zod"

// Shape of one job file in app/data/jobs/<slug>.json, as saved by Pages CMS (.pages.yml).
// Kept free of Nuxt/Vite imports: nuxt.config.ts uses it too.

const text = z.object({
  // Page heading and card title, e.g. "Boom ram rebuilt for a JCB 3CX".
  title: z.string().trim().min(1),
  // One or two sentences for the card, the page intro and the meta description.
  summary: z.string().trim().min(1),
  machine: z.string().trim().min(1),
  location: z.string().trim().min(1),
  problem: z.string().trim().min(1),
  work: z.array(z.string().trim().min(1)).min(1),
  result: z.string().trim().min(1),
  imageAlt: z.string().trim().min(1),
})

export const jobFileSchema = z.object({
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  published: z.boolean().default(false),
  date: z.iso.date(),
  service: z.string(),
  image: z.string().min(1),
  en: text,
  // Optional while drafting; the job stays hidden until the Welsh is complete.
  cy: z.unknown().optional(),
})

export type JobText = z.infer<typeof text>
export interface Job extends Omit<z.infer<typeof jobFileSchema>, "cy"> {
  cy: JobText
}

// A job goes live once it's marked published and its Welsh is complete. Anything else is
// skipped with a reason, so a half-finished CMS entry never breaks the build.
export function parseJob(
  file: string,
  data: unknown,
): { job: Job } | { skipped: string } {
  const parsed = jobFileSchema.safeParse(data)
  if (!parsed.success)
    return { skipped: `${file}: ${z.prettifyError(parsed.error)}` }
  if (!parsed.data.published) return { skipped: `${file}: not published` }
  const cy = text.safeParse(parsed.data.cy)
  if (!cy.success)
    return { skipped: `${file}: published but the Welsh isn't complete` }
  return { job: { ...parsed.data, cy: cy.data } }
}
