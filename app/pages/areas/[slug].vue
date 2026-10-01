<script setup lang="ts">
import { contentByLocale } from "~/content"

const route = useRoute()
const { business } = useAppConfig()
const { url: siteUrl } = useSiteConfig()
const content = useContent()
const localePath = useLocalePath()
const page = computed(() => content.value.areaPage)

const area = computed(() =>
  content.value.areas.find((a) => a.slug === String(route.params.slug)),
)
if (!area.value)
  throw createError({
    statusCode: 404,
    statusMessage: page.value.notFound,
    fatal: true,
  })

const path = `/areas/${area.value.slug}`
// Jobs are matched on the English town name, which is what staff type as the location, and
// structured data uses the English place names.
const englishArea = contentByLocale.en.areas.find(
  (a) => a.slug === area.value!.slug,
)!
const englishTown = englishArea.town

usePageSeo({
  title: area.value.metaTitle,
  description: area.value.metaDescription,
  path,
})
useBreadcrumbs([
  { name: content.value.common.home, path: "/" },
  { name: area.value.h1, path },
])
useJsonLd("area-service", {
  "@type": "Service",
  name: area.value.h1,
  serviceType: "Hydraulic repair",
  description: area.value.metaDescription,
  url: new URL(localePath(path), siteUrl).href,
  provider: { "@id": useBusinessId() },
  areaServed: [
    { "@type": "City", name: englishTown },
    ...englishArea.nearby.map((name) => ({ "@type": "Place", name })),
  ],
})

const crumbs = computed(() => [
  { label: content.value.common.home, to: localePath("/") },
  { label: area.value!.town, class: "text-white" },
])
const travel = computed(() => [
  {
    icon: "i-lucide-ruler",
    label: page.value.distance,
    value: area.value!.travel.distance,
  },
  {
    icon: "i-lucide-car",
    label: page.value.time,
    value: area.value!.travel.time,
  },
  {
    icon: "i-lucide-route",
    label: page.value.route,
    value: area.value!.travel.route,
  },
])
const faqs = computed(() =>
  area.value!.faqs.map((faq) => ({ label: faq.q, content: faq.a })),
)
</script>

<template>
  <div>
    <PageHero labelledby="area-title">
      <UBreadcrumb
        :items="crumbs"
        separator-icon="i-lucide-slash"
        :ui="heroBreadcrumbUi"
      />
      <h1
        id="area-title"
        class="heading-display max-w-4xl text-[clamp(40px,6vw,76px)] leading-[0.95] tracking-tight"
      >
        {{ area!.h1 }}
      </h1>
      <p class="mt-5 max-w-xl text-base text-zinc-200 sm:text-lg">
        {{ area!.lead }}
      </p>
      <div class="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-5">
        <UButton
          :to="business.phoneHref"
          icon="i-lucide-phone"
          size="xl"
          class="h-14 justify-center px-6"
        >
          {{ content.common.call(business.phoneDisplay) }}
        </UButton>
        <UButton
          :to="directionsUrl(business.address)"
          target="_blank"
          icon="i-lucide-navigation"
          color="neutral"
          variant="outline"
          size="xl"
          class="h-14 justify-center bg-transparent px-6 text-white ring-2 ring-white hover:bg-white hover:text-ink-950"
        >
          {{ page.directions }}
        </UButton>
      </div>
    </PageHero>

    <section class="py-16 sm:py-20">
      <UContainer
        class="grid items-start gap-10 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:gap-14"
      >
        <article class="max-w-3xl">
          <p
            v-for="(paragraph, i) in area!.intro"
            :key="i"
            class="mb-4.5"
            :class="
              i === 0
                ? 'text-[17px] text-ink-950 sm:text-[19px]'
                : 'text-zinc-600'
            "
          >
            {{ paragraph }}
          </p>

          <h2 class="heading-display mt-12 mb-5.5 text-[clamp(24px,3vw,32px)]">
            {{ page.servicesTitle }}
          </h2>
          <!-- Two by two; an odd number of services (three while on-site work is off) gets a
               "send us a photo" card so the grid stays even. -->
          <div class="grid gap-5 sm:grid-cols-2">
            <ServiceCard
              v-for="service in content.services"
              :key="service.slug"
              :service="service"
            />
            <div
              v-if="content.services.length % 2"
              class="flex flex-col rounded-box bg-primary p-6 text-white"
            >
              <UIcon name="i-lucide-camera" class="size-9" />
              <p class="kicker mt-5 mb-2 text-[11px]">
                {{ page.photoCard.kicker }}
              </p>
              <h3 class="heading-display mb-2.5 text-xl leading-tight">
                {{ page.photoCard.title }}
              </h3>
              <p class="mb-6 flex-1 text-sm text-white/90">
                {{ page.photoCard.text }}
              </p>
              <UButton
                :to="`mailto:${business.email}?subject=${encodeURIComponent(page.photoCard.emailSubject)}`"
                icon="i-lucide-mail"
                color="neutral"
                variant="solid"
                size="lg"
                block
                class="bg-white text-ink-950 hover:bg-ink-950 hover:text-white"
              >
                {{ page.photoCard.button }}
              </UButton>
            </div>
          </div>

          <h2 class="heading-display mt-12 mb-3 text-[clamp(24px,3vw,32px)]">
            {{ page.faqTitle }}
          </h2>
          <UAccordion
            :items="faqs"
            type="multiple"
            :default-value="['0']"
            trailing-icon="i-lucide-chevron-down"
            :ui="{
              item: 'border-zinc-200',
              trigger: 'py-5 text-base font-extrabold hover:text-chs-700',
              trailingIcon: 'size-5 text-primary',
              body: 'pb-5 text-zinc-600 max-w-2xl',
            }"
          />
        </article>

        <aside
          class="grid gap-5 sm:grid-cols-2 lg:sticky lg:top-[calc(var(--header-offset)+1.5rem)] lg:transition-[top] lg:duration-300 lg:grid-cols-1"
          :aria-label="page.gettingHere(area!.fromTown)"
        >
          <div class="rounded-box bg-ink-900 p-6 text-white sm:p-7.5">
            <h2 class="heading-display mb-2 text-lg leading-tight">
              {{ page.gettingHere(area!.fromTown) }}
            </h2>
            <dl class="divide-y divide-white/10">
              <div
                v-for="item in travel"
                :key="item.label"
                class="flex items-start gap-3 py-3.5 text-sm"
              >
                <UIcon :name="item.icon" class="size-5 shrink-0 text-chs-400" />
                <dt class="font-bold">{{ item.label }}</dt>
                <dd class="ms-auto text-end text-zinc-300">{{ item.value }}</dd>
              </div>
            </dl>
            <address class="mt-3 text-sm text-zinc-300 not-italic">
              <template
                v-for="(line, i) in addressLines(business.address)"
                :key="line"
                ><br v-if="i" />{{ line }}</template
              >
            </address>
            <UButton
              :to="directionsUrl(business.address)"
              target="_blank"
              icon="i-lucide-navigation"
              size="xl"
              block
              class="mt-5"
            >
              {{ page.directions }}
            </UButton>
          </div>

          <div class="rounded-box bg-zinc-100 px-5 py-6 sm:px-7.5">
            <h2 class="heading-display mb-3.5 text-[13px] tracking-wide">
              {{ page.nearbyTitle }}
            </h2>
            <ul class="flex flex-wrap gap-2">
              <li v-for="place in area!.nearby" :key="place">
                <UBadge
                  :label="place"
                  color="neutral"
                  variant="outline"
                  size="lg"
                  class="bg-white"
                />
              </li>
            </ul>
          </div>
        </aside>
      </UContainer>
    </section>

    <RecentJobs
      :kicker="page.jobsKicker"
      :title="page.jobsTitle(area!.inTown)"
      :town="englishTown"
      muted
    />

    <CtaBand :kicker="page.ctaKicker(area!.town)" />
  </div>
</template>
