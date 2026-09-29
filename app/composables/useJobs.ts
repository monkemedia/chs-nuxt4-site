import { onsiteServiceSlug, type LocaleCode } from "~/content"
import { jobs } from "~/data/jobs"

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
