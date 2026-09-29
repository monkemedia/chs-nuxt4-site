import { readdirSync, readFileSync } from "node:fs"
import { join } from "node:path"
import { addTypeTemplate, addVitePlugin, defineNuxtModule } from "nuxt/kit"
import { parseJob, type Job } from "../app/data/jobs-schema"

// Loads Recent work from app/data/jobs/*.json at build time and serves it as `#jobs`.
// Only the jobs a build should show are bundled: live ones, plus drafts in dev and in the
// preview build (NUXT_PUBLIC_SHOW_DRAFTS=true), so unpublished jobs never reach the live
// site's HTML or JavaScript. /work is left out of the prerender and sitemap while empty.
export default defineNuxtModule({
  meta: { name: "jobs" },
  setup(_, nuxt) {
    const dir = join(nuxt.options.rootDir, "app/data/jobs")
    const drafts =
      nuxt.options.dev || process.env.NUXT_PUBLIC_SHOW_DRAFTS === "true"

    const load = (warn: boolean) => {
      const jobs: Job[] = []
      for (const file of readdirSync(dir).filter((f) => f.endsWith(".json"))) {
        let data: unknown
        try {
          data = JSON.parse(readFileSync(join(dir, file), "utf8"))
        } catch {
          if (warn) console.warn(`[jobs] Skipped ${file}: not valid JSON`)
          continue
        }
        const result = parseJob(file, data)
        if ("skipped" in result) {
          if (warn) console.warn(`[jobs] Skipped ${result.skipped}`)
        } else if (result.job.draft && !drafts) {
          if (warn)
            console.warn(
              `[jobs] Not live: ${file} (${result.job.draft === "welsh" ? "the Welsh isn't complete" : "not published"})`,
            )
        } else jobs.push(result.job)
      }
      return jobs
    }

    if (!load(true).length) {
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

    const id = "#jobs"
    addVitePlugin({
      name: "chs-jobs",
      resolveId: (source) => (source === id ? `\0${id}` : undefined),
      load(resolved) {
        if (resolved !== `\0${id}`) return
        this.addWatchFile(dir)
        for (const file of readdirSync(dir)) this.addWatchFile(join(dir, file))
        return `export const jobs = ${JSON.stringify(load(false))}`
      },
    })
    addTypeTemplate({
      filename: "types/jobs.d.ts",
      getContents: () =>
        `declare module "#jobs" {\n  export const jobs: import("${join(nuxt.options.rootDir, "app/data/jobs-schema")}").Job[]\n}\n`,
    })
  },
})
