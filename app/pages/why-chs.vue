<script setup lang="ts">
const content = useContent()
const localePath = useLocalePath()
const page = computed(() => content.value.why)

usePageSeo({ ...page.value.seo, path: "/why-chs" })
useBreadcrumbs([
  { name: content.value.common.home, path: "/" },
  { name: page.value.crumb, path: "/why-chs" },
])

const crumbs = computed(() => [
  { label: content.value.common.home, to: localePath("/") },
  { label: page.value.crumb, class: "text-white" },
])
</script>

<template>
  <div>
    <PageHero labelledby="why-title">
      <UBreadcrumb
        :items="crumbs"
        separator-icon="i-lucide-slash"
        :ui="heroBreadcrumbUi"
      />
      <h1
        id="why-title"
        class="heading-display text-[clamp(40px,6vw,76px)] leading-[0.95] tracking-tight"
      >
        {{ page.title[0] }}
        <span class="block text-primary">{{ page.title[1] }}</span>
      </h1>
      <p class="mt-5 max-w-xl text-base text-zinc-200 sm:text-lg">
        {{ page.intro }}
      </p>
    </PageHero>

    <section class="py-16 sm:py-20" aria-labelledby="reasons-title">
      <UContainer>
        <p class="kicker mb-3 text-chs-600">{{ page.reasonsKicker }}</p>
        <h2
          id="reasons-title"
          class="heading-display mb-10 text-[clamp(28px,3.6vw,40px)]"
        >
          {{ page.reasonsTitle }}
        </h2>
        <ul class="grid gap-5 md:grid-cols-2">
          <li
            v-for="benefit in content.benefits"
            :key="benefit.icon + benefit.title[0]"
            class="flex gap-5 border-t-3 border-primary bg-zinc-100 p-6 sm:p-8"
          >
            <UIcon :name="benefit.icon" class="size-11 shrink-0 text-primary" />
            <div>
              <h3 class="heading-display mb-1 text-xl">
                {{ benefit.title.join(" ") }}
              </h3>
              <p class="mb-3 font-semibold">{{ benefit.summary }}</p>
              <p class="text-[15px] text-zinc-600">{{ benefit.detail }}</p>
            </div>
          </li>
        </ul>
      </UContainer>
    </section>

    <ReviewsSection
      :kicker="page.reviewsKicker"
      :title="page.reviewsTitle"
      :limit="6"
      muted
    />

    <section
      class="relative isolate overflow-hidden bg-ink-950 py-16 text-white sm:py-20"
      aria-labelledby="promise-title"
    >
      <div
        class="absolute inset-y-0 right-0 -z-10 w-full bg-[url('/images/why-bg.jpg')] bg-cover bg-right lg:w-3/5"
        aria-hidden="true"
      >
        <div
          class="size-full bg-linear-to-r from-ink-950/95 to-ink-950/75 lg:from-ink-950 lg:via-ink-950/60 lg:to-ink-950/40"
        />
      </div>
      <UContainer
        class="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:gap-16"
      >
        <div>
          <p class="kicker mb-3 text-chs-400">{{ page.promiseKicker }}</p>
          <h2
            id="promise-title"
            class="heading-display text-[clamp(28px,3.6vw,40px)]"
          >
            {{ page.promiseTitle }}
          </h2>
          <p class="mt-4 text-zinc-300">
            {{ page.promiseText }}
          </p>
        </div>
        <ul class="grid gap-x-8 gap-y-4 sm:grid-cols-2">
          <li
            v-for="promise in page.promises"
            :key="promise"
            class="flex items-start gap-3 text-[15px] font-semibold"
          >
            <span
              class="mt-px grid size-5.5 shrink-0 place-items-center rounded-full bg-primary text-white"
            >
              <UIcon name="i-lucide-check" class="size-3.5" />
            </span>
            {{ promise }}
          </li>
        </ul>
      </UContainer>
    </section>

    <section class="py-16 sm:py-20" aria-labelledby="steps-title">
      <UContainer>
        <p class="kicker mb-3 text-chs-600">{{ page.stepsKicker }}</p>
        <h2
          id="steps-title"
          class="heading-display mb-10 text-[clamp(28px,3.6vw,40px)]"
        >
          {{ page.stepsTitle }}
        </h2>
        <ol class="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <li
            v-for="(step, i) in page.steps"
            :key="step.title"
            class="relative bg-zinc-100 p-6 pt-7"
          >
            <span
              class="heading-display absolute top-5 right-5 text-3xl text-zinc-300"
              aria-hidden="true"
              >{{ String(i + 1).padStart(2, "0") }}</span
            >
            <UIcon :name="step.icon" class="size-9 text-primary" />
            <h3 class="heading-display mt-4 mb-2 text-base leading-tight">
              {{ step.title }}
            </h3>
            <p class="text-sm text-zinc-600">{{ step.text }}</p>
          </li>
        </ol>
      </UContainer>
    </section>

    <CtaBand :kicker="page.ctaKicker" />
  </div>
</template>
