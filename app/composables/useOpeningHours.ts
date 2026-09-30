import { closures, openingHours } from "~/data/hours"

// Opening hours (from the admin area, else app.config `openingHours`) and upcoming holiday
// closures with their reason in the current language. Untranslated reasons show the
// English, marked lang="en".
export function useOpeningHours() {
  const { business } = useAppConfig()
  const content = useContent()

  const specs = openingHours ?? business.openingHours
  const localClosures = computed(() =>
    closures.map(({ reason, ...closure }) => {
      const english = content.value.locale !== "en" && !reason.cy
      return {
        ...closure,
        reason:
          english || content.value.locale === "en" ? reason.en : reason.cy!,
        lang: english ? "en" : undefined,
      }
    }),
  )

  return {
    specs,
    periods: parseOpeningHours(specs),
    closures: localClosures,
  }
}
