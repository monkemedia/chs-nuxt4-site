import {
  contentByLocale,
  onsiteServiceSlug,
  workshopByLocale,
  type LocaleCode,
} from "~/content"
import { applyOverrides } from "~/content/overrides"

// Copy for the current language (see app/content/). Use in templates as content.home.heroCopy.
// {years} and {hours} in any string are filled in from app.config `offer`, and {founder1},
// {founder2}, {founded} and {tagline} from `business`, so they stay the same in every language.
// While app.config `features.onsite` is off, the workshop-only copy (app/content/<locale>/
// workshop.ts) replaces anything that mentions on-site work, and the On-site Service is
// removed everywhere services are listed (so its page isn't linked, prerendered or mapped).
export function useContent() {
  const { locale } = useI18n()
  const { business, features, offer } = useAppConfig()

  const tokens: Record<string, string> = {
    years: String(offer.yearsExperience),
    hours: String(offer.responseHours),
    founder1: business.founders[0]?.name ?? "",
    founder2: business.founders[1]?.name ?? "",
    founded: business.foundingYear,
    tagline: business.tagline,
  }
  const fill = <T>(value: T): T => {
    if (typeof value === "string")
      return value.replace(
        /\{(years|hours|founder1|founder2|founded|tagline)\}/g,
        (_, key: string) => tokens[key]!,
      ) as T
    if (Array.isArray(value)) return value.map(fill) as T
    if (value && typeof value === "object")
      return Object.fromEntries(
        Object.entries(value).map(([key, item]) => [key, fill(item)]),
      ) as T
    return value
  }

  const forFeatures = (code: LocaleCode) => {
    const content = contentByLocale[code]
    if (features.onsite) return content
    const workshop = applyOverrides(content, workshopByLocale[code])
    return {
      ...workshop,
      services: workshop.services.filter((s) => s.slug !== onsiteServiceSlug),
      sectors: workshop.sectors.map((sector) => ({
        ...sector,
        services: sector.services.filter((slug) => slug !== onsiteServiceSlug),
      })),
    }
  }

  return computed(() => fill(forFeatures(locale.value as LocaleCode)))
}
