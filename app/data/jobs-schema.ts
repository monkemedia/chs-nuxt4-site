import * as z from "zod"

// Shape of one job file in app/data/jobs/<slug>.json, as saved by Pages CMS (.pages.yml).
// Kept free of Nuxt/Vite imports: nuxt.config.ts uses it too.

const text = z.object({
  // Page heading and card title, e.g. "Boom ram rebuilt for a JCB 3CX".
  title: z.string().trim().min(1),
  // One or two sentences for the card, the page intro and the meta description.
  summary: z.string().trim().min(1),
  // Optional: left out of the page and card when empty.
  machine: z.string().trim().optional(),
  location: z.string().trim().optional(),
  problem: z.string().trim().min(1),
  work: z.array(z.string().trim().min(1)).min(1),
  result: z.string().trim().min(1),
  // Optional: the job title is used when it's empty.
  imageAlt: z.string().trim().optional(),
})

export const jobFileSchema = z.object({
  published: z.boolean().default(false),
  date: z.iso.date(),
  service: z.string(),
  // Optional: cards fall back to the service's image; the job page shows no photo.
  image: z.string().trim().optional(),
  en: text,
  // Optional while drafting; the job stays hidden until the Welsh is complete.
  cy: z.unknown().optional(),
})

export type JobText = z.infer<typeof text>
export interface Job extends Omit<z.infer<typeof jobFileSchema>, "cy"> {
  slug: string
  cy: JobText
  // Why it isn't live yet. Drafts only reach the preview build (NUXT_PUBLIC_SHOW_DRAFTS).
  draft?: "unpublished" | "welsh"
}

// The URL slug is the file name, which Pages CMS makes from the English title when the job
// is first saved. It doesn't follow later title edits, so published links never break.
const slugFromFile = (file: string) =>
  file
    .replace(/^.*\//, "")
    .replace(/\.json$/, "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")

// A job goes live once it's marked published and its Welsh is complete; until then it's a
// draft (its Welsh pages show the English). Invalid files are skipped with a reason, so a
// half-finished CMS entry never breaks the build.
export function parseJob(
  file: string,
  data: unknown,
): { job: Job } | { skipped: string } {
  const parsed = jobFileSchema.safeParse(data)
  if (!parsed.success)
    return { skipped: `${file}: ${z.prettifyError(parsed.error)}` }
  const slug = slugFromFile(file)
  if (!slug)
    return { skipped: `${file}: can't make a web address from the file name` }
  const cy = text.safeParse(parsed.data.cy)
  const draft = !parsed.data.published
    ? "unpublished"
    : !cy.success
      ? "welsh"
      : undefined
  return {
    job: {
      ...parsed.data,
      slug,
      cy: cy.success ? cy.data : parsed.data.en,
      ...(draft ? { draft } : {}),
    },
  }
}
