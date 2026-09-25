<script setup lang="ts">
import { benefits } from "~/data/benefits"

usePageSeo({
  title: "Why Choose CHS | Hydraulic Repairs Llanelli & Carmarthenshire",
  description:
    "Fast response, an experienced team, quality components and a mobile service unit: why businesses across Llanelli and Carmarthenshire choose CHS for hydraulic repairs.",
  path: "/why-chs",
})
useBreadcrumbs([
  { name: "Home", path: "/" },
  { name: "Why CHS", path: "/why-chs" },
])

const crumbs = [
  { label: "Home", to: "/" },
  { label: "Why CHS", class: "text-white" },
]

const promises = [
  "We explain the fault and the fix before any work starts",
  "Realistic turnaround times, and we keep you updated",
  "Parts matched to the job and working pressure",
  "Hoses made up while you wait for most standard sizes",
  "Workshop or on-site, whichever gets you working sooner",
  "Clear pricing with no surprises on the invoice",
]

const steps = [
  {
    icon: "i-lucide-phone-call",
    title: "Call or send an enquiry",
    text: "Tell us the machine, what's happened and where it is.",
  },
  {
    icon: "i-lucide-search",
    title: "We diagnose the problem",
    text: "In the workshop or on-site, we find the real cause, not just the symptom.",
  },
  {
    icon: "i-lucide-wrench",
    title: "We fix it properly",
    text: "Quality parts, fitted and tested, so it stays fixed.",
  },
  {
    icon: "i-lucide-circle-check-big",
    title: "Back to work",
    text: "Your machine is running again with minimal downtime.",
  },
]
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
        Minimum downtime.
        <span class="block text-primary">Maximum support.</span>
      </h1>
      <p class="mt-5 max-w-xl text-base text-zinc-200 sm:text-lg">
        Why businesses across Llanelli, Carmarthenshire and South Wales trust
        CHS with their hydraulics.
      </p>
    </PageHero>

    <section class="py-16 sm:py-20" aria-labelledby="reasons-title">
      <UContainer>
        <p class="kicker mb-3 text-chs-600">Why choose CHS</p>
        <h2
          id="reasons-title"
          class="heading-display mb-10 text-[clamp(28px,3.6vw,40px)]"
        >
          Four reasons customers come back
        </h2>
        <ul class="grid gap-5 md:grid-cols-2">
          <li
            v-for="benefit in benefits"
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
          <p class="kicker mb-3 text-chs-400">Our promise</p>
          <h2
            id="promise-title"
            class="heading-display text-[clamp(28px,3.6vw,40px)]"
          >
            What you get every time
          </h2>
          <p class="mt-4 text-zinc-300">
            However big or small the job, this is how we work.
          </p>
        </div>
        <ul class="grid gap-x-8 gap-y-4 sm:grid-cols-2">
          <li
            v-for="promise in promises"
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
        <p class="kicker mb-3 text-chs-600">How it works</p>
        <h2
          id="steps-title"
          class="heading-display mb-10 text-[clamp(28px,3.6vw,40px)]"
        >
          From breakdown to back at work
        </h2>
        <ol class="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <li
            v-for="(step, i) in steps"
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

    <CtaBand kicker="Ready when you are" />
  </div>
</template>
