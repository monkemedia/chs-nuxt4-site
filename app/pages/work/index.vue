<script setup lang="ts">
const content = useContent()
const localePath = useLocalePath()
const { jobs } = useJobs()
const page = computed(() => content.value.jobsPage)

// Nothing links here until real jobs exist, so it isn't prerendered; guard direct visits.
if (!jobs.value.length)
  throw createError({
    statusCode: 404,
    statusMessage: content.value.jobPage.notFound,
    fatal: true,
  })

usePageSeo({ ...page.value.seo, path: "/work" })
useBreadcrumbs([
  { name: content.value.common.home, path: "/" },
  { name: page.value.crumb, path: "/work" },
])

const crumbs = computed(() => [
  { label: content.value.common.home, to: localePath("/") },
  { label: page.value.crumb, class: "text-white" },
])
</script>

<template>
  <div>
    <PageHero labelledby="jobs-title">
      <UBreadcrumb
        :items="crumbs"
        separator-icon="i-lucide-slash"
        :ui="heroBreadcrumbUi"
      />
      <h1
        id="jobs-title"
        class="heading-display text-[clamp(46px,6vw,76px)] leading-none tracking-tight"
      >
        {{ page.title[0] }}
        <em class="text-primary not-italic">{{ page.title[1] }}</em>
      </h1>
      <p class="mt-5 max-w-xl text-base text-zinc-200 sm:text-lg">
        {{ page.intro }}
      </p>
    </PageHero>

    <section class="py-16 sm:py-20" :aria-label="content.recentJobs.listLabel">
      <UContainer>
        <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <JobCard
            v-for="job in jobs"
            :key="job.slug"
            :job="job"
            heading-level="h2"
          />
        </div>
      </UContainer>
    </section>

    <CtaBand
      :kicker="page.cta.kicker"
      :title="page.cta.title"
      :text="page.cta.text"
    />
  </div>
</template>
