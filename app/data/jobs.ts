// Recent work (case studies) shown at /work, /work/<slug>, on the homepage and on the
// matching service page. Staff add and edit jobs in the admin area (/admin, Sanity; see
// AGENTS.md "Admin area").
//
// Only ever publish REAL jobs CHS has done:
// - Name a customer only with their permission; otherwise describe them ("a Carmarthenshire
//   dairy farm", "a groundworks contractor in Llanelli").
// - Use CHS's own photos of the job, never stock photos presented as the job.
// Made-up case studies mislead customers and breach UK consumer law (CMA), like fake reviews.
//
// While no job is live the section, pages and links are hidden on the live site. Drafts
// (unpublished) show only in dev and the preview build.

export type { Job, JobText } from "./jobs-schema"

// Fetched from Sanity and filtered at build time by modules/jobs.ts.
export { jobs } from "virtual:chs-jobs"
