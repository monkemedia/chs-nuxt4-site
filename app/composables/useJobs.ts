import { en } from "~/content/en"
import { onsiteServiceSlug, type LocaleCode } from "~/content"
import { jobs, type Job } from "~/data/jobs"
import { sampleJobs } from "~/data/jobs.sample"

// Fail the build on a duplicate slug or an unknown service rather than ship a broken
// link (the CMS offers only valid services, so this means a hand edit went wrong).
if (import.meta.server) {
  const serviceSlugs = en.services.map((s) => s.slug)
  const seen = new Set<string>()
  for (const job of jobs) {
    if (seen.has(job.slug))
      throw new Error(`[jobs] Duplicate job slug "${job.slug}".`)
    seen.add(job.slug)
    if (!serviceSlugs.includes(job.service))
      throw new Error(
        `[jobs] "${job.slug}" has unknown service "${job.service}".`,
      )
  }
}

// Recent jobs in the current language, newest first. Until real jobs are added, dev builds
// use labelled samples; production has none, so every jobs section, page and link hides.
// `import.meta.dev` is written out in the expression (as in useReviews) so production
// builds drop the samples. Jobs for the On-site Service hide while `features.onsite` is off.
export function useJobs() {
  const { locale } = useI18n()
  const { features } = useAppConfig()

  const showSamples = import.meta.dev && jobs.length === 0
  const source: Job[] = import.meta.dev && jobs.length === 0 ? sampleJobs : jobs

  const allJobs = computed(() =>
    [...source]
      .filter((job) => features.onsite || job.service !== onsiteServiceSlug)
      .sort((a, b) => b.date.localeCompare(a.date))
      .map(({ en, cy, ...job }) => ({
        ...job,
        ...{ en, cy }[locale.value as LocaleCode],
      })),
  )

  return { showSamples, jobs: allJobs }
}

export type LocalJob = ReturnType<typeof useJobs>["jobs"]["value"][number]
