import { vacancies } from "~/data/vacancies"

// Open vacancies in the current language, newest first. With none, the careers page and
// its links hide.
export function useVacancies() {
  const { locale } = useI18n()
  const content = useContent()

  const pounds = (value: number) =>
    `£${value.toLocaleString("en-GB", {
      minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
    })}`

  const localVacancies = computed(() =>
    [...vacancies]
      .sort((a, b) => b.posted.localeCompare(a.posted))
      .map(({ en, cy, ...vacancy }) => {
        // Untranslated vacancies show their English on the Welsh site, marked lang="en".
        const english = locale.value !== "en" && !cy
        const page = content.value.vacancyPage
        return {
          ...vacancy,
          ...(english || locale.value === "en" ? en : cy!),
          lang: english ? "en" : undefined,
          typeLabel: page.types[vacancy.type],
          pay: vacancy.salaryMin
            ? page.payRange(
                pounds(vacancy.salaryMin),
                vacancy.salaryMax && vacancy.salaryMax !== vacancy.salaryMin
                  ? pounds(vacancy.salaryMax)
                  : undefined,
                vacancy.salaryPeriod,
              )
            : undefined,
        }
      }),
  )

  return { vacancies: localVacancies }
}

export type LocalVacancy = ReturnType<
  typeof useVacancies
>["vacancies"]["value"][number]
