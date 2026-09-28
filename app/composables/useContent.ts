import { contentByLocale, type LocaleCode } from "~/content"

// Copy for the current language (see app/content/). Use in templates as content.home.heroCopy.
// {years} and {hours} in any string are filled in from app.config `offer`, so the numbers
// stay the same in every language and live in one place.
export function useContent() {
  const { locale } = useI18n()
  const { offer } = useAppConfig()

  const tokens: Record<string, string> = {
    years: String(offer.yearsExperience),
    hours: String(offer.responseHours),
  }
  const fill = <T>(value: T): T => {
    if (typeof value === "string")
      return value.replace(
        /\{(years|hours)\}/g,
        (_, key: string) => tokens[key]!,
      ) as T
    if (Array.isArray(value)) return value.map(fill) as T
    if (value && typeof value === "object")
      return Object.fromEntries(
        Object.entries(value).map(([key, item]) => [key, fill(item)]),
      ) as T
    return value
  }

  return computed(() => fill(contentByLocale[locale.value as LocaleCode]))
}
