import { en } from "~/content/en"
import { onsiteServiceSlug, type LocaleCode } from "~/content"
import { jobs } from "~/data/jobs"

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

// Recent jobs in the current language, newest first. With none, every jobs section, page
// and link hides. Jobs for the On-site Service hide while `features.onsite` is off.
export function useJobs() {
  const { locale } = useI18n()
  const { features } = useAppConfig()

  const allJobs = computed(() =>
    [...jobs]
      .filter((job) => features.onsite || job.service !== onsiteServiceSlug)
      .sort((a, b) => b.date.localeCompare(a.date))
      .map(({ en, cy, ...job }) => {
        // Untranslated jobs show their English on the Welsh site, marked lang="en".
        const english = locale.value !== "en" && !cy
        return {
          ...job,
          ...(english || locale.value === "en" ? en : cy!),
          lang: english ? "en" : undefined,
        }
      }),
  )

  return { jobs: allJobs }
}

export type LocalJob = ReturnType<typeof useJobs>["jobs"]["value"][number]
