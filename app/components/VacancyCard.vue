<script setup lang="ts">
import type { LocalVacancy } from "~/composables/useVacancies"

defineProps<{ vacancy: LocalVacancy; headingLevel?: "h2" | "h3" }>()

const content = useContent()
const localePath = useLocalePath()

const formatDate = (date: string) =>
  dayjs.utc(date).locale(content.value.dateLocale).format("D MMMM YYYY")
</script>

<template>
  <article
    class="group relative flex flex-col rounded-box border-t-3 border-primary bg-white px-6 pt-6 pb-6 pr-12 shadow-[0_10px_30px_rgba(15,22,26,0.09)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_16px_38px_rgba(15,22,26,0.15)]"
  >
    <div class="mb-3 flex flex-wrap items-center gap-2">
      <UBadge
        v-if="vacancy.draft"
        color="warning"
        variant="solid"
        icon="i-lucide-pencil-line"
        :label="content.vacancyPage.draft"
      />
      <p class="kicker text-[11px] text-chs-700">
        {{ vacancy.typeLabel }}
        <template v-if="vacancy.pay"> · {{ vacancy.pay }}</template>
      </p>
    </div>
    <component
      :is="headingLevel ?? 'h3'"
      class="heading-display mb-2.5 text-xl leading-tight"
      :lang="vacancy.lang"
    >
      <NuxtLink
        :to="localePath(`/careers/${vacancy.slug}`)"
        class="after:absolute after:inset-0 after:z-10"
        >{{ vacancy.title }}</NuxtLink
      >
    </component>
    <p class="flex-1 text-sm text-zinc-600" :lang="vacancy.lang">
      {{ vacancy.summary }}
    </p>
    <ul class="mt-4 grid gap-1.5 text-xs font-bold text-zinc-500">
      <li class="flex items-center gap-1.5">
        <UIcon name="i-lucide-map-pin" class="size-4 text-primary" />
        {{ content.vacancyPage.locationValue }}
      </li>
      <li v-if="vacancy.closes" class="flex items-center gap-1.5">
        <UIcon name="i-lucide-calendar-clock" class="size-4 text-primary" />
        {{ content.vacancyPage.closes }}:
        <time :datetime="vacancy.closes">{{ formatDate(vacancy.closes) }}</time>
      </li>
      <li v-if="vacancy.lang" class="flex items-center gap-1.5">
        <UIcon name="i-lucide-languages" class="size-4 text-primary" />
        {{ content.jobPage.englishOnly }}
      </li>
    </ul>
    <UIcon
      name="i-lucide-chevron-right"
      class="absolute right-4 bottom-6 size-5 text-primary transition-transform group-hover:translate-x-1"
    />
  </article>
</template>
