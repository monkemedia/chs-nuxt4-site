<script setup lang="ts">
const route = useRoute()
const { business } = useAppConfig()
const { url: siteUrl } = useSiteConfig()
const content = useContent()
const localePath = useLocalePath()
const { vacancies } = useVacancies()
const page = computed(() => content.value.vacancyPage)

const vacancy = computed(() =>
  vacancies.value.find((v) => v.slug === String(route.params.slug)),
)
if (!vacancy.value)
  throw createError({
    statusCode: 404,
    statusMessage: page.value.notFound,
    fatal: true,
  })

const path = `/careers/${vacancy.value.slug}`

// Staff don't write SEO fields in the admin area: the title and summary double as them.
usePageSeo({
  title: `${vacancy.value.title} | Careers at CHS Hydraulics`,
  description: vacancy.value.summary,
  path,
})
useBreadcrumbs([
  { name: content.value.common.home, path: "/" },
  { name: content.value.careersPage.crumb, path: "/careers" },
  { name: vacancy.value.title, path },
])

// Google for Jobs. The description must match what's on the page.
const { address } = business
const listHtml = (items: string[]) =>
  items.length ? `<ul>${items.map((i) => `<li>${i}</li>`).join("")}</ul>` : ""
const employmentType = {
  "full-time": "FULL_TIME",
  "part-time": "PART_TIME",
  apprenticeship: "FULL_TIME",
  temporary: "TEMPORARY",
}[vacancy.value.type]
useJsonLd("job-posting", {
  "@type": "JobPosting",
  title: vacancy.value.title,
  description: [
    `<p>${vacancy.value.about}</p>`,
    listHtml(vacancy.value.responsibilities),
    listHtml(vacancy.value.requirements),
    listHtml(vacancy.value.niceToHave),
    listHtml(vacancy.value.offer),
  ].join(""),
  datePosted: vacancy.value.posted,
  ...(vacancy.value.closes
    ? { validThrough: `${vacancy.value.closes}T23:59:59` }
    : {}),
  employmentType,
  url: new URL(localePath(path), siteUrl).href,
  hiringOrganization: {
    "@type": "Organization",
    name: business.name,
    sameAs: siteUrl,
  },
  jobLocation: {
    "@type": "Place",
    address: {
      "@type": "PostalAddress",
      ...(address.street ? { streetAddress: address.street } : {}),
      addressLocality: address.locality,
      addressRegion: address.region,
      ...(address.postcode ? { postalCode: address.postcode } : {}),
      addressCountry: "GB",
    },
  },
  ...(vacancy.value.salaryMin
    ? {
        baseSalary: {
          "@type": "MonetaryAmount",
          currency: "GBP",
          value: {
            "@type": "QuantitativeValue",
            ...(vacancy.value.salaryMax
              ? {
                  minValue: vacancy.value.salaryMin,
                  maxValue: vacancy.value.salaryMax,
                }
              : { value: vacancy.value.salaryMin }),
            unitText: vacancy.value.salaryPeriod === "year" ? "YEAR" : "HOUR",
          },
        },
      }
    : {}),
})

const crumbs = computed(() => [
  { label: content.value.common.home, to: localePath("/") },
  { label: content.value.careersPage.crumb, to: localePath("/careers") },
  { label: vacancy.value!.title, class: "text-white" },
])
const formatDate = (date: string) =>
  dayjs.utc(date).locale(content.value.dateLocale).format("D MMMM YYYY")
const facts = computed(() =>
  [
    {
      icon: "i-lucide-briefcase",
      label: page.value.type,
      value: vacancy.value!.typeLabel,
    },
    {
      icon: "i-lucide-banknote",
      label: page.value.pay,
      value: vacancy.value!.pay,
    },
    {
      icon: "i-lucide-clock",
      label: page.value.hours,
      value: vacancy.value!.hours,
      lang: vacancy.value!.lang,
    },
    {
      icon: "i-lucide-map-pin",
      label: page.value.location,
      value: page.value.locationValue,
    },
    {
      icon: "i-lucide-calendar-plus",
      label: page.value.posted,
      value: formatDate(vacancy.value!.posted),
    },
    {
      icon: "i-lucide-calendar-clock",
      label: page.value.closes,
      value: vacancy.value!.closes && formatDate(vacancy.value!.closes),
    },
  ].filter((fact) => fact.value),
)
const sections = computed(() =>
  [
    {
      title: page.value.responsibilities,
      items: vacancy.value!.responsibilities,
    },
    { title: page.value.requirements, items: vacancy.value!.requirements },
    { title: page.value.niceToHave, items: vacancy.value!.niceToHave },
    { title: page.value.offer, items: vacancy.value!.offer },
  ].filter((section) => section.items.length),
)
const applyHref = computed(
  () =>
    `mailto:${business.email}?subject=${encodeURIComponent(page.value.emailSubject(vacancy.value!.title))}`,
)
const cvAction = computed(() => ({
  label: content.value.careersPage.cta.button,
  to: `mailto:${business.email}?subject=${encodeURIComponent(content.value.careersPage.cta.emailSubject)}`,
  icon: "i-lucide-mail",
}))
</script>

<template>
  <div>
    <div
      v-if="vacancy!.draft"
      class="bg-amber-300 py-3 text-sm font-bold text-ink-950"
      role="status"
    >
      <UContainer class="flex items-center gap-2.5">
        <UIcon name="i-lucide-pencil-line" class="size-5 shrink-0" />
        {{ page.draft }}: {{ page.draftNote }}
      </UContainer>
    </div>

    <PageHero labelledby="vacancy-title">
      <UBreadcrumb
        :items="crumbs"
        separator-icon="i-lucide-slash"
        :ui="heroBreadcrumbUi"
      />
      <p class="kicker mb-3 text-chs-400">
        {{ vacancy!.typeLabel }}
        <template v-if="vacancy!.pay"> · {{ vacancy!.pay }}</template>
      </p>
      <h1
        id="vacancy-title"
        class="heading-display max-w-4xl text-[clamp(36px,5vw,64px)] leading-[0.95] tracking-tight"
        :lang="vacancy!.lang"
      >
        {{ vacancy!.title }}
      </h1>
      <p
        class="mt-5 max-w-xl text-base text-zinc-200 sm:text-lg"
        :lang="vacancy!.lang"
      >
        {{ vacancy!.summary }}
      </p>
    </PageHero>

    <section class="py-16 sm:py-20">
      <UContainer
        class="grid items-start gap-10 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:gap-14"
      >
        <article class="max-w-3xl" :lang="vacancy!.lang">
          <p
            v-if="vacancy!.lang"
            class="mb-6 flex items-center gap-1.5 text-sm font-bold text-zinc-500"
            lang="cy"
          >
            <UIcon name="i-lucide-languages" class="size-4 text-primary" />
            {{ content.jobPage.englishOnly }}
          </p>

          <h2 class="heading-display mb-4 text-[clamp(24px,3vw,32px)]">
            {{ page.about }}
          </h2>
          <p class="text-[17px] text-zinc-700">{{ vacancy!.about }}</p>

          <template v-for="section in sections" :key="section.title">
            <h2 class="heading-display mt-12 mb-5 text-[clamp(24px,3vw,32px)]">
              {{ section.title }}
            </h2>
            <ul class="grid gap-3">
              <li
                v-for="(item, i) in section.items"
                :key="i"
                class="flex items-start gap-3 text-[15px]"
              >
                <UIcon
                  name="i-lucide-check"
                  class="mt-0.5 size-5 shrink-0 text-primary"
                />
                {{ item }}
              </li>
            </ul>
          </template>
        </article>

        <aside
          class="grid gap-5 sm:grid-cols-2 lg:sticky lg:top-[calc(var(--header-offset)+1.5rem)] lg:transition-[top] lg:duration-300 lg:grid-cols-1"
          :aria-label="page.details"
        >
          <div class="rounded-box bg-zinc-100 px-5 py-5 sm:px-7.5 sm:py-6">
            <h2 class="heading-display mb-2 text-[13px] tracking-wide">
              {{ page.details }}
            </h2>
            <dl class="divide-y divide-zinc-200">
              <div
                v-for="fact in facts"
                :key="fact.label"
                class="flex items-start gap-3 py-3.5 text-sm"
              >
                <UIcon :name="fact.icon" class="size-5 shrink-0 text-primary" />
                <dt class="font-bold">{{ fact.label }}</dt>
                <dd class="ms-auto text-end text-zinc-600" :lang="fact.lang">
                  {{ fact.value }}
                </dd>
              </div>
            </dl>
          </div>

          <div class="rounded-box bg-primary p-6 text-white sm:p-7.5">
            <p class="kicker mb-3">{{ page.applyKicker }}</p>
            <h2 class="heading-display mb-3 text-2xl leading-[1.1]">
              {{ page.applyTitle }}
            </h2>
            <p class="mb-5 text-sm">{{ page.applyText }}</p>
            <UButton
              :to="applyHref"
              icon="i-lucide-mail"
              color="neutral"
              variant="solid"
              size="xl"
              block
              class="bg-white text-[17px] text-ink-950 hover:bg-ink-950 hover:text-white"
            >
              {{ page.applyByEmail }}
            </UButton>
            <a
              :href="business.phoneHref"
              class="mt-4 inline-flex items-center gap-2 text-[13px] font-extrabold tracking-wider text-white uppercase hover:underline"
            >
              <UIcon name="i-lucide-phone" class="size-4" />
              {{ business.phoneDisplay }}
            </a>
          </div>
        </aside>
      </UContainer>
    </section>

    <CtaBand
      :kicker="content.careersPage.cta.kicker"
      :title="content.careersPage.cta.title"
      :text="content.careersPage.cta.text"
      :action="cvAction"
    />
  </div>
</template>
