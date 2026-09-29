import { join } from "node:path"
import { addTypeTemplate, addVitePlugin, defineNuxtModule } from "nuxt/kit"
import { services } from "../app/content/en/services"
import { parseJob, type Job } from "../app/data/jobs-schema"
import { fetchSanityContent } from "./lib/sanity"

// Loads Recent work from Sanity (the admin area at /admin) at build time and serves it as
// `virtual:chs-jobs`. Only the jobs a build should show are bundled: published ones, plus
// drafts in dev and in the preview build (NUXT_PUBLIC_SHOW_DRAFTS=true), so unpublished jobs
// never reach the live site's HTML or JavaScript. /work is left out of the prerender and
// sitemap while empty. Publishing in the admin area triggers a rebuild (AGENTS.md "Admin").
export default defineNuxtModule({
  meta: { name: "jobs" },
  async setup(_, nuxt) {
    const drafts =
      nuxt.options.dev || process.env.NUXT_PUBLIC_SHOW_DRAFTS === "true"
    const content = await fetchSanityContent(drafts)

    const jobs: Job[] = []
    const slugs = new Set<string>()
    for (const data of content.jobs) {
      const result = parseJob(data)
      if ("skipped" in result) {
        console.warn(`[jobs] Skipped ${result.skipped}`)
      } else if (!services.some((s) => s.slug === result.job.service)) {
        console.warn(
          `[jobs] Skipped ${result.job.slug}: unknown service "${result.job.service}"`,
        )
      } else if (slugs.has(result.job.slug)) {
        console.warn(
          `[jobs] Skipped ${result.job.slug}: web address used twice`,
        )
      } else if (result.job.draft && !drafts) {
        console.warn(`[jobs] Not live: ${result.job.slug} (not published)`)
      } else {
        slugs.add(result.job.slug)
        jobs.push(result.job)
      }
    }

    if (!jobs.length) {
      nuxt.options.nitro.prerender ??= {}
      nuxt.options.nitro.prerender.ignore = [
        ...(nuxt.options.nitro.prerender.ignore ?? []),
        "/work",
        "/cy/work",
      ]
      // @nuxtjs/sitemap reads this from the Nuxt options.
      const options = nuxt.options as { sitemap?: { exclude?: string[] } }
      options.sitemap = {
        ...options.sitemap,
        exclude: [...(options.sitemap?.exclude ?? []), "/work", "/cy/work"],
      }
    }

    // No "#" in the id: in dev it becomes part of a URL, where "#" starts the fragment.
    const id = "virtual:chs-jobs"
    addVitePlugin({
      name: "chs-jobs",
      resolveId: (source) => (source === id ? `\0${id}` : undefined),
      load: (resolved) =>
        resolved === `\0${id}`
          ? `export const jobs = ${JSON.stringify(jobs)}`
          : undefined,
    })
    addTypeTemplate({
      filename: "types/jobs.d.ts",
      getContents: () =>
        `declare module "virtual:chs-jobs" {\n  export const jobs: import("${join(nuxt.options.rootDir, "app/data/jobs-schema")}").Job[]\n}\n`,
    })
  },
})
