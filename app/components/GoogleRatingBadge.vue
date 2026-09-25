<script setup lang="ts">
import { ratingBadgeThreshold } from "~/data/reviews"

// Compact "★★★★★ 4.8 on Google · 23 reviews" line for the dark homepage hero.
// Hidden until the Google rating meets ratingBadgeThreshold.
const { showSamples, summary, readUrl } = useReviews()

const visible =
  !!summary &&
  summary.count >= ratingBadgeThreshold.minReviews &&
  summary.rating >= ratingBadgeThreshold.minRating
</script>

<template>
  <component
    :is="readUrl ? 'a' : 'span'"
    v-if="visible && summary"
    :href="readUrl || undefined"
    :target="readUrl ? '_blank' : undefined"
    :rel="readUrl ? 'noopener' : undefined"
    class="group inline-flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-zinc-200"
    :class="{ 'hover:text-white': readUrl }"
  >
    <StarRating :rating="summary.rating" class="text-lg" />
    <span>
      <strong class="font-extrabold text-white">{{
        summary.rating.toFixed(1)
      }}</strong>
      on Google ·
      <span :class="{ 'underline-offset-4 group-hover:underline': readUrl }"
        >{{ summary.count }} reviews</span
      >
    </span>
    <DevOnly>
      <span v-if="showSamples" class="text-xs text-amber-300">(sample)</span>
    </DevOnly>
  </component>
</template>
