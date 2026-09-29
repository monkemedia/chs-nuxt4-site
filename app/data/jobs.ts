import { parseJob, type Job } from "./jobs-schema"

// Recent work (case studies) shown at /work, /work/<slug>, on the homepage and on the
// matching service page. Each job is a JSON file in app/data/jobs/, edited by staff in
// Pages CMS (see .pages.yml and AGENTS.md "Recent work").
//
// Only ever publish REAL jobs CHS has done:
// - Name a customer only with their permission; otherwise describe them ("a Carmarthenshire
//   dairy farm", "a groundworks contractor in Llanelli").
// - Use CHS's own photos of the job, never stock photos presented as the job.
// Made-up case studies mislead customers and breach UK consumer law (CMA), like fake reviews.
//
// While no job is live the section, pages and links are hidden on the live site.
// `npm run dev` shows labelled samples instead (see jobs.sample.ts).

export type { Job, JobText } from "./jobs-schema"

const files = import.meta.glob<unknown>("./jobs/*.json", {
  eager: true,
  import: "default",
})

export const jobs: Job[] = []
for (const [file, data] of Object.entries(files)) {
  const result = parseJob(file, data)
  if ("job" in result) jobs.push(result.job)
  else if (import.meta.server) console.warn(`[jobs] Skipped ${result.skipped}`)
}
