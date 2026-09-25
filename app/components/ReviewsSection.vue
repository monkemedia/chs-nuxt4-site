<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    kicker?: string
    title?: string
    limit?: number
    muted?: boolean
  }>(),
  {
    kicker: "What customers say",
    title: "Trusted by businesses across South Wales",
    limit: 3,
    muted: false,
  },
)

const { showSamples, allReviews, summary, readUrl, writeUrl } = useReviews()
const items = allReviews.slice(0, props.limit)

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  })
</script>

<template>
  <section
    v-if="items.length"
    class="py-16 sm:py-20"
    :class="muted ? 'bg-zinc-100' : 'bg-white'"
    aria-labelledby="reviews-title"
  >
    <UContainer>
      <DevOnly>
        <UBadge
          v-if="showSamples"
          color="warning"
          variant="subtle"
          icon="i-lucide-flask-conical"
          label="Sample reviews: dev preview only, hidden in production"
          class="mb-6"
        />
      </DevOnly>

      <div
        class="mb-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end"
      >
        <div>
          <p class="kicker mb-3 text-chs-600">{{ kicker }}</p>
          <h2
            id="reviews-title"
            class="heading-display max-w-2xl text-[clamp(28px,3.6vw,40px)]"
          >
            {{ title }}
          </h2>
        </div>

        <div v-if="summary" class="flex items-center gap-4">
          <span class="heading-display text-5xl">{{
            summary.rating.toFixed(1)
          }}</span>
          <div>
            <StarRating :rating="summary.rating" class="text-xl" />
            <p class="mt-1 text-sm text-zinc-600">
              from {{ summary.count }} Google reviews
            </p>
          </div>
        </div>
      </div>

      <ul class="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        <li
          v-for="(review, i) in items"
          :key="i"
          class="flex"
          :class="{ 'md:max-lg:last:odd:col-span-2': items.length > 2 }"
        >
          <figure
            class="flex w-full flex-col border-t-3 border-primary bg-white p-6 shadow-[0_10px_30px_rgba(15,22,26,0.08)] sm:p-7"
          >
            <div class="mb-4 flex items-center justify-between gap-3">
              <StarRating
                v-if="review.rating"
                :rating="review.rating"
                class="text-lg"
              />
              <UIcon
                name="i-lucide-quote"
                class="ms-auto size-8 text-chs-100"
              />
            </div>
            <blockquote class="flex-1 text-[15px] text-ink-950">
              <p>{{ review.text }}</p>
            </blockquote>
            <figcaption class="mt-6 border-t border-zinc-200 pt-4">
              <p class="font-extrabold">{{ review.author }}</p>
              <p class="text-sm text-zinc-600">
                {{
                  review.company ??
                  (review.source === "google" ? "Google review" : "Customer")
                }}
                · {{ formatDate(review.date) }}
              </p>
            </figcaption>
          </figure>
        </li>
      </ul>

      <div v-if="readUrl" class="mt-10 flex flex-col gap-3 sm:flex-row">
        <UButton
          :to="readUrl"
          target="_blank"
          color="neutral"
          variant="outline"
          size="xl"
          trailing-icon="i-lucide-external-link"
          class="justify-center bg-transparent text-ink-950 ring-2 ring-ink-950 hover:bg-ink-950 hover:text-white"
        >
          Read all reviews on Google
        </UButton>
        <UButton
          :to="writeUrl"
          target="_blank"
          size="xl"
          icon="i-lucide-star"
          class="justify-center"
        >
          Leave us a review
        </UButton>
      </div>
    </UContainer>
  </section>
</template>
