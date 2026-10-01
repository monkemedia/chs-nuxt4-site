<script setup lang="ts">
import type { NuxtError } from "#app"

const props = defineProps<{ error: NuxtError }>()

// While the site is in coming-soon or maintenance mode, every missing page shows the
// holding page too.
const runtimeConfig = useRuntimeConfig()
const siteMode = runtimeConfig.public.siteMode as
  "live" | "coming-soon" | "maintenance"

const { business } = useAppConfig()
const content = useContent()
const localePath = useLocalePath()

const code = computed(() => props.error.statusCode || 500)
const page = computed(() => content.value.errorPage)
const copy = computed(() =>
  code.value === 404 ? page.value.notFound : page.value.server,
)
const links = computed(() => [
  ...content.value.services.map((s) => ({
    label: s.h1,
    icon: s.icon,
    to: localePath(`/services/${s.slug}`),
  })),
  {
    label: content.value.nav.contact,
    icon: "i-lucide-mail",
    to: localePath("/contact"),
  },
])

useSeoMeta({
  title: () => `${copy.value.title.join(" ")} | CHS Hydraulics`,
  robots: "noindex, follow",
})

// Clear the error before leaving so the next page renders normally.
const leave = (to: string) => clearError({ redirect: to })
</script>

<template>
  <HoldingPage v-if="siteMode !== 'live'" :mode="siteMode" />
  <NuxtLayout v-else>
    <section
      class="relative isolate overflow-hidden bg-ink-950 py-16 text-white sm:py-24"
      aria-labelledby="error-title"
    >
      <!-- Faint oversized code behind everything. -->
      <!-- Drawn with CSS content, not text, so it isn't read or contrast-checked. -->
      <div
        class="heading-display pointer-events-none absolute -right-6 -bottom-10 -z-10 text-[clamp(160px,30vw,420px)] leading-none text-white/[0.03] select-none before:content-[attr(data-code)]"
        :data-code="code"
        aria-hidden="true"
      />
      <UContainer
        class="grid items-center gap-12 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]"
      >
        <div>
          <p class="kicker mb-4 text-chs-400">{{ copy.kicker }}</p>
          <h1
            id="error-title"
            class="heading-display text-[clamp(48px,8vw,104px)] leading-[0.9] tracking-tight"
          >
            {{ copy.title[0] }}
            <em class="block text-primary not-italic">{{ copy.title[1] }}</em>
          </h1>
          <p class="mt-6 max-w-lg text-base text-zinc-300 sm:text-lg">
            {{ copy.text }}
          </p>
          <div class="mt-9 flex flex-col gap-3 sm:flex-row sm:gap-5">
            <UButton
              icon="i-lucide-house"
              size="xl"
              class="h-14 justify-center px-6"
              @click="leave(localePath('/'))"
            >
              {{ page.home }}
            </UButton>
            <UButton
              :to="business.phoneHref"
              icon="i-lucide-phone"
              color="neutral"
              variant="outline"
              size="xl"
              class="h-14 justify-center bg-transparent px-6 text-white ring-2 ring-white hover:bg-white hover:text-ink-950"
            >
              {{ content.common.call(business.phoneDisplay) }}
            </UButton>
          </div>
        </div>

        <ErrorGauge
          :reading="code"
          :unit="page.gaugeUnit"
          :label="page.gaugeLabel(code)"
          class="mx-auto w-full max-w-[260px] sm:max-w-[340px] drop-shadow-[0_24px_48px_rgba(229,16,31,0.18)]"
        />
      </UContainer>
    </section>

    <section class="bg-zinc-100 py-14" aria-labelledby="error-links-title">
      <UContainer>
        <h2
          id="error-links-title"
          class="heading-display mb-6 text-[clamp(22px,2.6vw,28px)]"
        >
          {{ page.tryThese }}
        </h2>
        <ul class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <li v-for="link in links" :key="link.to">
            <a
              :href="link.to"
              class="group flex h-full items-center gap-3 rounded-box bg-white px-5 py-4 text-sm font-bold shadow-[0_6px_18px_rgba(15,22,26,0.07)] transition hover:-translate-y-0.5 hover:text-chs-700"
              @click.prevent="leave(link.to)"
            >
              <UIcon :name="link.icon" class="size-5 shrink-0 text-primary" />
              {{ link.label }}
              <UIcon
                name="i-lucide-chevron-right"
                class="ms-auto size-4 shrink-0 text-primary transition-transform group-hover:translate-x-1"
              />
            </a>
          </li>
        </ul>
      </UContainer>
    </section>
  </NuxtLayout>
</template>
