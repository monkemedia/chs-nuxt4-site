import { contentByLocale, type LocaleCode } from "~/content"

// Copy for the current language (see app/content/). Use in templates as content.home.heroCopy.
export function useContent() {
  const { locale } = useI18n()
  return computed(() => contentByLocale[locale.value as LocaleCode])
}
