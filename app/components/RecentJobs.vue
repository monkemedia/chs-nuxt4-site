<script setup lang="ts">
// Latest jobs as a band of cards (homepage, service pages, other job pages). Renders
// nothing when there are no matching jobs.
const props = withDefaults(
  defineProps<{
    kicker?: string
    title?: string
    // Only jobs for this service slug.
    service?: string
    // Leave out this job slug (the job page it's on).
    exclude?: string
    limit?: number
    muted?: boolean
  }>(),
  { limit: 3, muted: false },
)

const content = useContent()
const localePath = useLocalePath()
const { jobs } = useJobs()

const items = computed(() =>
  jobs.value
    .filter(
      (job) =>
        (!props.service || job.service === props.service) &&
        job.slug !== props.exclude,
    )
    .slice(0, props.limit),
)
const kicker = computed(() => props.kicker ?? content.value.recentJobs.kicker)
const title = computed(() => props.title ?? content.value.recentJobs.title)
</script>

<template>
  <section
    v-if="items.length"
    class="py-16 sm:py-20"
    :class="muted ? 'bg-zinc-100' : 'bg-white'"
    aria-labelledby="recent-jobs-title"
  >
    <UContainer>
      <div
        class="mb-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end"
      >
        <div>
          <p class="kicker mb-3 text-chs-700">{{ kicker }}</p>
          <h2
            id="recent-jobs-title"
            class="heading-display max-w-2xl text-[clamp(28px,3.6vw,40px)]"
          >
            {{ title }}
          </h2>
        </div>
        <ULink
          raw
          :to="localePath('/work')"
          class="inline-flex items-center gap-2 border-b-2 border-primary pb-1.5 text-[13px] font-extrabold tracking-wider uppercase hover:text-chs-700"
        >
          {{ content.recentJobs.viewAll }}
          <UIcon name="i-lucide-chevron-right" class="size-4 text-primary" />
        </ULink>
      </div>

      <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <JobCard v-for="job in items" :key="job.slug" :job="job" />
      </div>
    </UContainer>
  </section>
</template>
