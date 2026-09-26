<script setup lang="ts">
const route = useRoute()
const { business } = useAppConfig()
const { url: siteUrl } = useSiteConfig()
const content = useContent()
const localePath = useLocalePath()
const page = computed(() => content.value.servicePage)

const service = computed(() =>
  content.value.services.find((s) => s.slug === String(route.params.slug)),
)
if (!service.value)
  throw createError({
    statusCode: 404,
    statusMessage: page.value.notFound,
    fatal: true,
  })

const path = `/services/${service.value.slug}`
const others = computed(() =>
  content.value.services.filter((s) => s.slug !== service.value!.slug),
)

usePageSeo({
  title: service.value.metaTitle,
  description: service.value.metaDescription,
  path,
})
useBreadcrumbs([
  { name: content.value.common.home, path: "/" },
  { name: content.value.servicesPage.crumb, path: "/services" },
  { name: service.value.title, path },
])
useJsonLd("service", {
  "@type": "Service",
  name: service.value.h1,
  serviceType: service.value.title,
  description: service.value.metaDescription,
  url: new URL(localePath(path), siteUrl).href,
  provider: { "@id": useBusinessId() },
  areaServed: business.towns.map((name) => ({ "@type": "City", name })),
})

const crumbs = computed(() => [
  { label: content.value.common.home, to: localePath("/") },
  { label: content.value.servicesPage.crumb, to: localePath("/services") },
  { label: service.value!.title, class: "text-white" },
])
const faqs = computed(() =>
  service.value!.faqs.map((faq) => ({ label: faq.q, content: faq.a })),
)
// English path; CtaBand localises it itself.
const enquiryPath = `/contact?service=${service.value.slug}`
const enquiryTo = computed(() => localePath(enquiryPath))
</script>

<template>
  <div>
    <PageHero labelledby="service-title">
      <UBreadcrumb
        :items="crumbs"
        separator-icon="i-lucide-slash"
        :ui="heroBreadcrumbUi"
      />
      <h1
        id="service-title"
        class="heading-display max-w-4xl text-[clamp(40px,6vw,76px)] leading-[0.95] tracking-tight"
      >
        {{ service!.h1 }}
      </h1>
      <p class="mt-5 max-w-xl text-base text-zinc-200 sm:text-lg">
        {{ service!.lead }}
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
          :to="enquiryTo"
          color="neutral"
          variant="outline"
          trailing-icon="i-lucide-chevron-right"
          size="xl"
          class="h-14 justify-center px-6 bg-transparent text-white ring-2 ring-white hover:bg-white hover:text-ink-950"
        >
          {{ content.common.sendEnquiry }}
        </UButton>
      </div>
    </PageHero>

    <section class="py-16 sm:py-20">
      <UContainer
        class="grid items-start gap-10 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:gap-14"
      >
        <article class="max-w-3xl">
          <p
            v-for="(paragraph, i) in service!.intro"
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
            {{ page.whatWeDo }}
          </h2>
          <ul class="grid gap-x-6 gap-y-3.5 sm:grid-cols-2">
            <li
              v-for="item in service!.includes"
              :key="item"
              class="flex items-start gap-3 text-[15px] font-semibold"
            >
              <span
                class="mt-px grid size-5.5 shrink-0 place-items-center rounded-full bg-primary text-white"
              >
                <UIcon name="i-lucide-check" class="size-3.5" />
              </span>
              {{ item }}
            </li>
          </ul>

          <h2 class="heading-display mt-12 mb-5.5 text-[clamp(24px,3vw,32px)]">
            {{ page.howItWorks }}
          </h2>
          <ol class="grid gap-4 sm:grid-cols-3">
            <li
              v-for="(step, i) in service!.process"
              :key="step.title"
              class="border-t-3 border-primary bg-zinc-100 px-5 py-6"
            >
              <span
                class="heading-display text-[28px] text-chs-700"
                aria-hidden="true"
                >{{ String(i + 1).padStart(2, "0") }}</span
              >
              <h3 class="heading-display mt-3 mb-2 text-base leading-tight">
                {{ step.title }}
              </h3>
              <p class="text-sm text-zinc-600">{{ step.text }}</p>
            </li>
          </ol>

          <h2 class="heading-display mt-12 mb-3 text-[clamp(24px,3vw,32px)]">
            {{ page.commonQuestions }}
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
          class="grid gap-5 sm:grid-cols-2 lg:sticky lg:top-[calc(var(--ui-header-height)+1.5rem)] lg:grid-cols-1"
          :aria-label="page.getHelp"
        >
          <div
            class="bg-primary p-6 text-white sm:col-span-2 sm:p-7.5 lg:col-span-1"
          >
            <p class="kicker mb-3">{{ page.needSorted }}</p>
            <h2 class="heading-display mb-5 text-2xl leading-[1.1]">
              {{ page.talkToTeam }}
            </h2>
            <UButton
              :to="business.phoneHref"
              icon="i-lucide-phone"
              color="neutral"
              variant="solid"
              size="xl"
              block
              class="bg-white text-[17px] text-ink-950 hover:bg-ink-950 hover:text-white"
            >
              {{ business.phoneDisplay }}
            </UButton>
            <ULink
              raw
              :to="enquiryTo"
              class="mt-4 inline-flex items-center gap-2 text-[13px] font-extrabold tracking-wider text-white uppercase hover:underline"
            >
              {{ content.common.orSendEnquiry }}
              <UIcon name="i-lucide-chevron-right" class="size-4" />
            </ULink>
          </div>

          <nav
            class="bg-zinc-100 px-5 py-5 sm:px-7.5 sm:py-6"
            aria-labelledby="other-services-title"
          >
            <h2
              id="other-services-title"
              class="heading-display mb-2 text-[13px] tracking-wide"
            >
              {{ page.otherServices }}
            </h2>
            <ul class="divide-y divide-zinc-200">
              <li v-for="other in others" :key="other.slug">
                <ULink
                  raw
                  :to="localePath(`/services/${other.slug}`)"
                  class="flex items-center gap-3 py-3.5 text-sm font-bold hover:text-chs-700"
                >
                  <UIcon
                    :name="other.icon"
                    class="size-5 shrink-0 text-primary"
                  />
                  {{ other.h1 }}
                  <UIcon
                    name="i-lucide-chevron-right"
                    class="ms-auto size-4 shrink-0 text-primary"
                  />
                </ULink>
              </li>
            </ul>
          </nav>

          <div class="bg-ink-900 px-5 py-6 text-white sm:px-7.5">
            <h3 class="heading-display mb-3.5 text-[13px] tracking-wide">
              {{ page.areasWeCover }}
            </h3>
            <ul class="flex flex-wrap gap-2">
              <li v-for="area in content.business.serviceArea" :key="area">
                <UBadge
                  :label="area"
                  color="neutral"
                  variant="outline"
                  size="lg"
                  class="bg-transparent text-white ring-white/25"
                />
              </li>
            </ul>
          </div>
        </aside>
      </UContainer>
    </section>

    <CtaBand
      :kicker="page.ctaKicker"
      :text="page.ctaText"
      :enquiry-to="enquiryPath"
    />
  </div>
</template>
