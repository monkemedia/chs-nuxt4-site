import { closures, draft, openingHours } from "~/data/hours"

// Opening hours (from the admin area, else app.config `openingHours`) and upcoming holiday
// closures with their reason and dates ("24 Dec – 1 Jan") in the current language.
// Untranslated reasons show the English, marked lang="en".
export function useOpeningHours() {
  const { business } = useAppConfig()
  const content = useContent()

  const specs = openingHours ?? business.openingHours
  const periods = parseOpeningHours(specs)
  // One { open, close } (minutes) per weekday, Monday first; null when closed all day.
  const week: ({ open: number; close: number } | null)[] = Array(7).fill(null)
  for (const { from, to, open, close } of periods)
    for (let d = from; d <= to; d++) week[d] = { open, close }

  const localClosures = computed(() =>
    closures.map(({ reason, ...closure }) => {
      const english = content.value.locale !== "en" && !reason.cy
      const date = (d: string) =>
        dayjs(d).locale(content.value.dateLocale).format("D MMM")
      return {
        ...closure,
        dates:
          closure.from === closure.to
            ? date(closure.from)
            : `${date(closure.from)} – ${date(closure.to)}`,
        reason:
          english || content.value.locale === "en" ? reason.en : reason.cy!,
        lang: english ? "en" : undefined,
      }
    }),
  )

  return {
    specs,
    periods,
    week,
    closures: localClosures,
    draft,
  }
}
