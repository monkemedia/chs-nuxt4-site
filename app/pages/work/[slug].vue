<script setup lang="ts">
const route = useRoute()
const { business } = useAppConfig()
const { url: siteUrl } = useSiteConfig()
const content = useContent()
const localePath = useLocalePath()
const { jobs } = useJobs()
const page = computed(() => content.value.jobPage)

const job = computed(() =>
  jobs.value.find((j) => j.slug === String(route.params.slug)),
)
if (!job.value)
  throw createError({
    statusCode: 404,
    statusMessage: page.value.notFound,
    fatal: true,
  })

const path = `/work/${job.value.slug}`
const service = computed(() =>
  content.value.services.find((s) => s.slug === job.value!.service),
)

// Staff don't write SEO fields in the CMS: the title and summary double as them.
usePageSeo({
  title: `${job.value.title} | CHS Hydraulics`,
  description: job.value.summary,
  path,
  ...(job.value.image ? { image: job.value.image } : {}),
})
useBreadcrumbs([
  { name: content.value.common.home, path: "/" },
  { name: content.value.jobsPage.crumb, path: "/work" },
  { name: job.value.title, path },
])
useJsonLd("article", {
  "@type": "Article",
  headline: job.value.title,
  description: job.value.summary,
  ...(job.value.image ? { image: new URL(job.value.image, siteUrl).href } : {}),
  datePublished: job.value.date,
  url: new URL(localePath(path), siteUrl).href,
  author: { "@id": useBusinessId() },
  publisher: { "@id": useBusinessId() },
})

const crumbs = computed(() => [
  { label: content.value.common.home, to: localePath("/") },
  { label: content.value.jobsPage.crumb, to: localePath("/work") },
  { label: job.value!.title, class: "text-white" },
])
const facts = computed(() =>
  [
    {
      icon: "i-lucide-tractor",
      label: page.value.machine,
      value: job.value!.machine,
    },
    {
      icon: "i-lucide-map-pin",
      label: page.value.location,
      value: job.value!.location,
    },
    {
      icon: "i-lucide-calendar-check",
      label: page.value.completed,
      value: dayjs
        .utc(job.value!.date)
        .locale(content.value.dateLocale)
        .format("MMMM YYYY"),
    },
  ].filter((fact) => fact.value),
)
// English path; CtaBand localises it itself.
const enquiryPath = `/contact?service=${job.value.service}`
const enquiryTo = computed(() => localePath(enquiryPath))
</script>

<template>
  <div>
    <div
      v-if="job!.draft"
      class="bg-amber-300 py-3 text-sm font-bold text-ink-950"
      role="status"
    >
      <UContainer class="flex items-center gap-2.5">
        <UIcon name="i-lucide-pencil-line" class="size-5 shrink-0" />
        {{ page.draft }}: {{ page.draftNote[job!.draft] }}
      </UContainer>
    </div>

    <PageHero labelledby="job-title">
      <UBreadcrumb
        :items="crumbs"
        separator-icon="i-lucide-slash"
        :ui="heroBreadcrumbUi"
      />
      <h1
        id="job-title"
        class="heading-display max-w-4xl text-[clamp(36px,5vw,64px)] leading-[0.95] tracking-tight"
      >
        {{ job!.title }}
      </h1>
      <p class="mt-5 max-w-xl text-base text-zinc-200 sm:text-lg">
        {{ job!.summary }}
      </p>
    </PageHero>

    <section class="py-16 sm:py-20">
      <UContainer
        class="grid items-start gap-10 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:gap-14"
      >
        <article class="max-w-3xl">
          <NuxtPicture
            v-if="job!.image"
            :src="job!.image"
            :alt="job!.imageAlt || job!.title"
            sizes="800px"
            width="800"
            height="500"
            densities="x1"
            format="avif,webp"
            :img-attrs="{
              class: 'aspect-8/5 w-full rounded-box bg-ink-950 object-cover',
            }"
          />

          <h2
            class="heading-display mt-12 mb-4 text-[clamp(24px,3vw,32px)] first:mt-0"
          >
            {{ page.problem }}
          </h2>
          <p class="text-[17px] text-zinc-700">{{ job!.problem }}</p>

          <h2 class="heading-display mt-12 mb-5.5 text-[clamp(24px,3vw,32px)]">
            {{ page.whatWeDid }}
          </h2>
          <ol class="grid gap-3.5">
            <li
              v-for="(step, i) in job!.work"
              :key="i"
              class="flex items-start gap-3 text-[15px] font-semibold"
            >
              <span
                class="grid size-6 shrink-0 place-items-center rounded-full bg-primary text-xs text-white"
                aria-hidden="true"
                >{{ i + 1 }}</span
              >
              {{ step }}
            </li>
          </ol>

          <h2 class="heading-display mt-12 mb-4 text-[clamp(24px,3vw,32px)]">
            {{ page.result }}
          </h2>
          <p
            class="rounded-box border-t-3 border-primary bg-zinc-100 px-5 py-6 text-[17px] text-ink-950"
          >
            {{ job!.result }}
          </p>
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
                <dd class="ms-auto text-end text-zinc-600">{{ fact.value }}</dd>
              </div>
            </dl>
            <ULink
              v-if="service"
              raw
              :to="localePath(`/services/${service.slug}`)"
              class="mt-2 flex items-center gap-3 border-t border-zinc-200 pt-3.5 text-sm font-bold hover:text-chs-700"
            >
              <UIcon
                :name="service.icon"
                class="size-5 shrink-0 text-primary"
              />
              {{ service.h1 }}
              <UIcon
                name="i-lucide-chevron-right"
                class="ms-auto size-4 shrink-0 text-primary"
              />
            </ULink>
          </div>

          <div class="rounded-box bg-primary p-6 text-white sm:p-7.5">
            <p class="kicker mb-3">{{ page.similarProblem }}</p>
            <h2 class="heading-display mb-5 text-2xl leading-[1.1]">
              {{ content.servicePage.talkToTeam }}
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
        </aside>
      </UContainer>
    </section>

    <RecentJobs
      :kicker="content.recentJobs.moreKicker"
      :title="content.recentJobs.moreTitle"
      :exclude="job!.slug"
      muted
    />

    <CtaBand
      :kicker="page.ctaKicker"
      :text="page.ctaText"
      :enquiry-to="enquiryPath"
    />
  </div>
</template>
