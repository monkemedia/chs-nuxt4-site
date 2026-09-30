<script setup lang="ts">
const content = useContent()
const localePath = useLocalePath()
const { business } = useAppConfig()
const { vacancies } = useVacancies()
const page = computed(() => content.value.careersPage)

// Nothing links here until a vacancy is live, so it isn't prerendered; guard direct visits.
if (!vacancies.value.length)
  throw createError({
    statusCode: 404,
    statusMessage: content.value.vacancyPage.notFound,
    fatal: true,
  })

usePageSeo({ ...page.value.seo, path: "/careers" })
useBreadcrumbs([
  { name: content.value.common.home, path: "/" },
  { name: page.value.crumb, path: "/careers" },
])

const crumbs = computed(() => [
  { label: content.value.common.home, to: localePath("/") },
  { label: page.value.crumb, class: "text-white" },
])
const cvAction = computed(() => ({
  label: content.value.careersPage.cta.button,
  to: `mailto:${business.email}?subject=${encodeURIComponent(content.value.careersPage.cta.emailSubject)}`,
  icon: "i-lucide-mail",
}))
</script>

<template>
  <div>
    <PageHero labelledby="careers-title">
      <UBreadcrumb
        :items="crumbs"
        separator-icon="i-lucide-slash"
        :ui="heroBreadcrumbUi"
      />
      <h1
        id="careers-title"
        class="heading-display text-[clamp(40px,6vw,76px)] leading-[0.95] tracking-tight"
      >
        {{ page.title[0] }}
        <em class="text-primary not-italic">{{ page.title[1] }}</em>
      </h1>
      <p class="mt-5 max-w-xl text-base text-zinc-200 sm:text-lg">
        {{ page.intro }}
      </p>
    </PageHero>

    <section class="py-16 sm:py-20" aria-labelledby="vacancies-title">
      <UContainer>
        <p class="kicker mb-3 text-chs-700">{{ page.listKicker }}</p>
        <h2
          id="vacancies-title"
          class="heading-display mb-10 text-[clamp(28px,3.6vw,40px)]"
        >
          {{ page.listTitle }}
        </h2>
        <div class="grid gap-5 md:grid-cols-2">
          <VacancyCard
            v-for="vacancy in vacancies"
            :key="vacancy.slug"
            :vacancy="vacancy"
          />
        </div>
      </UContainer>
    </section>

    <section class="bg-zinc-100 py-16 sm:py-20" aria-labelledby="why-title">
      <UContainer>
        <p class="kicker mb-3 text-chs-700">{{ page.whyKicker }}</p>
        <h2
          id="why-title"
          class="heading-display mb-10 text-[clamp(28px,3.6vw,40px)]"
        >
          {{ page.whyTitle }}
        </h2>
        <ul class="grid gap-5 md:grid-cols-3">
          <li
            v-for="item in page.why"
            :key="item.title"
            class="rounded-box border-t-3 border-primary bg-white p-6 sm:p-7"
          >
            <UIcon :name="item.icon" class="size-9 text-primary" />
            <h3 class="heading-display mt-4 mb-2 text-lg">{{ item.title }}</h3>
            <p class="text-sm text-zinc-600">{{ item.text }}</p>
          </li>
        </ul>
      </UContainer>
    </section>

    <CtaBand
      :kicker="page.cta.kicker"
      :title="page.cta.title"
      :text="page.cta.text"
      :action="cvAction"
    />
  </div>
</template>
