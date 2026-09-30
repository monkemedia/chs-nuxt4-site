import { join } from "node:path"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import timezone from "dayjs/plugin/timezone"
import { addTypeTemplate, addVitePlugin, defineNuxtModule } from "nuxt/kit"
import { exampleVacancies } from "../app/data/vacancies-examples"
import { parseVacancy, type Vacancy } from "../app/data/vacancies-schema"
import { fetchSanityContent } from "./lib/sanity"

dayjs.extend(utc)
dayjs.extend(timezone)

// Loads vacancies (the careers pages) from Sanity (the admin area at /admin) at build time
// and serves them as `virtual:chs-vacancies`, like modules/jobs.ts. Vacancies past their
// closing date are dropped, but only when the site rebuilds, so staff should unpublish a
// filled role. While there are none, /careers is left out of the prerender and sitemap;
// dev and the preview build show example vacancies instead (app/data/vacancies-examples.ts).
export default defineNuxtModule({
  meta: { name: "vacancies" },
  async setup(_, nuxt) {
    const drafts =
      nuxt.options.dev || process.env.NUXT_PUBLIC_SHOW_DRAFTS === "true"
    const content = await fetchSanityContent(drafts)
    const today = dayjs().tz("Europe/London").format("YYYY-MM-DD")

    const examples = drafts && !content.vacancies.length
    const source = examples
      ? exampleVacancies(
          today,
          dayjs(today).add(1, "month").format("YYYY-MM-DD"),
        )
      : content.vacancies

    const vacancies: Vacancy[] = []
    const slugs = new Set<string>()
    for (const data of source) {
      const result = parseVacancy(data)
      if ("skipped" in result) {
        console.warn(`[vacancies] Skipped ${result.skipped}`)
      } else if (slugs.has(result.vacancy.slug)) {
        console.warn(
          `[vacancies] Skipped ${result.vacancy.slug}: web address used twice`,
        )
      } else if (result.vacancy.draft && !drafts) {
        console.warn(
          `[vacancies] Not live: ${result.vacancy.slug} (not published)`,
        )
      } else if (result.vacancy.closes && result.vacancy.closes < today) {
        console.warn(
          `[vacancies] Not live: ${result.vacancy.slug} (closed ${result.vacancy.closes})`,
        )
      } else {
        slugs.add(result.vacancy.slug)
        vacancies.push(result.vacancy)
      }
    }
    if (examples)
      console.info("[vacancies] No vacancies yet: showing the examples.")

    if (!vacancies.length) {
      nuxt.options.nitro.prerender ??= {}
      nuxt.options.nitro.prerender.ignore = [
        ...(nuxt.options.nitro.prerender.ignore ?? []),
        "/careers",
        "/cy/careers",
      ]
      // @nuxtjs/sitemap reads its `exclude` option before this module runs, but checks
      // route rules when it builds the sitemap. (Its route rule types don't reach modules.)
      for (const path of ["/careers", "/cy/careers"])
        nuxt.options.routeRules = {
          ...nuxt.options.routeRules,
          [path]: {
            ...nuxt.options.routeRules?.[path],
            sitemap: false,
          } as never,
        }
    }

    // No "#" in the id: in dev it becomes part of a URL, where "#" starts the fragment.
    const id = "virtual:chs-vacancies"
    addVitePlugin({
      name: "chs-vacancies",
      resolveId: (source) => (source === id ? `\0${id}` : undefined),
      load: (resolved) =>
        resolved === `\0${id}`
          ? `export const vacancies = ${JSON.stringify(vacancies)}`
          : undefined,
    })
    addTypeTemplate({
      filename: "types/vacancies.d.ts",
      getContents: () =>
        `declare module "virtual:chs-vacancies" {\n  export const vacancies: import("${join(nuxt.options.rootDir, "app/data/vacancies-schema")}").Vacancy[]\n}\n`,
    })
  },
})
