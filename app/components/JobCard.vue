<script setup lang="ts">
import type { LocalJob } from "~/composables/useJobs"

const props = defineProps<{ job: LocalJob; headingLevel?: "h2" | "h3" }>()

const content = useContent()
const localePath = useLocalePath()

// Jobs without their own photo use the service's image so the cards stay even.
const photo = computed(() => {
  if (props.job.image)
    return { src: props.job.image, alt: props.job.imageAlt || props.job.title }
  const service = content.value.services.find(
    (s) => s.slug === props.job.service,
  )
  return { src: service?.image ?? "/images/hero.jpg", alt: "" }
})

const formatDate = (date: string) =>
  dayjs.utc(date).locale(content.value.dateLocale).format("MMMM YYYY")
</script>

<template>
  <article
    class="group relative flex flex-col overflow-hidden rounded-box bg-white shadow-[0_10px_30px_rgba(15,22,26,0.09)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_16px_38px_rgba(15,22,26,0.15)]"
  >
    <div class="relative aspect-8/5 bg-ink-950">
      <UBadge
        v-if="job.draft"
        color="warning"
        variant="solid"
        icon="i-lucide-pencil-line"
        :label="content.jobPage.draft"
        class="absolute top-3 left-3 z-10"
      />
      <NuxtPicture
        :src="photo.src"
        :alt="photo.alt"
        sizes="400px"
        width="400"
        height="250"
        densities="x1"
        format="avif,webp"
        loading="lazy"
        :img-attrs="{ class: 'size-full object-cover' }"
      />
    </div>
    <div class="relative flex-1 px-5 pt-5 pb-6 pr-12">
      <p class="kicker mb-2 text-[11px] text-chs-700">
        <time :datetime="job.date">{{ formatDate(job.date) }}</time>
        <template v-if="job.location"> · {{ job.location }}</template>
      </p>
      <component
        :is="headingLevel ?? 'h3'"
        class="heading-display mb-2.5 text-lg leading-tight"
      >
        <NuxtLink
          :to="localePath(`/work/${job.slug}`)"
          class="after:absolute after:inset-0 after:z-10"
          >{{ job.title }}</NuxtLink
        >
      </component>
      <p class="text-sm text-zinc-600">{{ job.summary }}</p>
      <UIcon
        name="i-lucide-chevron-right"
        class="absolute right-4 bottom-6 size-5 text-primary transition-transform group-hover:translate-x-1"
      />
    </div>
  </article>
</template>
