// Vacancies shown at /careers and /careers/<slug>. Staff add and edit them in the admin
// area (/admin, Sanity; see AGENTS.md "Careers").
//
// While no vacancy is live the page and its links are hidden on the live site. Drafts
// (unpublished) and, with none in the admin area, example vacancies show only in dev and
// the preview build.

export type { EmploymentType, Vacancy, VacancyText } from "./vacancies-schema"

// Fetched from Sanity and filtered at build time by modules/vacancies.ts.
export { vacancies } from "virtual:chs-vacancies"
