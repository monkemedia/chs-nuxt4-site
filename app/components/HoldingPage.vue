<script setup lang="ts">
// Full-screen holding page: "coming soon" before launch, "maintenance" while the site is down.
// Shown instead of every page by app.vue / error.vue when runtimeConfig `siteMode` says so,
// and at /coming-soon and /maintenance to preview. Keeps the phone, email and address up
// front: the workshop is open even when the website isn't.
const props = defineProps<{
  mode: "coming-soon" | "maintenance"
  // The /coming-soon and /maintenance preview pages on the live site.
  preview?: boolean
}>()

const { business } = useAppConfig()
// Language, canonical, hreflang and the LocalBusiness data, as on every other page.
const { content } = useSiteHead()
const switchLocalePath = useSwitchLocalePath()
const { locale } = useI18n()

const copy = computed(() =>
  props.mode === "coming-soon"
    ? content.value.holding.comingSoon
    : content.value.holding.maintenance,
)

// Before launch the coming-soon page should be indexed: it's the business's name, number and
// address on its own domain. Maintenance relies on the 503 from Vercel instead of noindex, so
// a noindex can never be what Google sees for the real pages. The preview URLs on the live
// site are never indexed.
useSeoMeta({
  title: () => copy.value.seo.title,
  description: () => copy.value.seo.description,
  ogTitle: () => copy.value.seo.title,
  ogDescription: () => copy.value.seo.description,
  robots: props.preview ? "noindex, nofollow" : "index, follow",
})

const otherLocale = computed(() => (locale.value === "en" ? "cy" : "en"))
const otherLocaleTag = computed(() =>
  otherLocale.value === "cy" ? "cy-GB" : "en-GB",
)
const otherLocaleFlag = computed(() =>
  otherLocale.value === "cy" ? "i-circle-flags-gb-wls" : "i-circle-flags-gb",
)
</script>

<template>
  <div
    class="relative isolate flex min-h-dvh flex-col overflow-hidden bg-ink-950 text-white"
  >
    <!-- Red glow behind the gauge and a faint oversized mark, for depth. -->
    <div
      class="absolute -top-40 -right-40 -z-10 size-[42rem] rounded-full bg-primary/15 blur-3xl"
      aria-hidden="true"
    />
    <!-- Drawn with CSS content, not text, so it isn't read or contrast-checked. -->
    <div
      class="heading-display pointer-events-none absolute -bottom-12 -left-6 -z-10 text-[clamp(180px,32vw,460px)] leading-none text-white/[0.03] select-none before:content-['CHS']"
      aria-hidden="true"
    />

    <header>
      <UContainer class="flex items-center justify-between gap-4 py-5">
        <NuxtPicture
          src="/images/chs-logo-mark-white.png"
          :alt="business.name"
          sizes="136px"
          width="136"
          height="60"
          densities="x1 x2"
          format="avif,webp"
          :img-attrs="{ class: 'h-auto w-[100px] sm:w-[136px]' }"
        />
        <div class="flex items-center gap-4">
          <NuxtLink
            :to="switchLocalePath(otherLocale)"
            :lang="otherLocaleTag"
            :hreflang="otherLocaleTag"
            :aria-label="content.common.languageSwitchLabel"
            class="inline-flex items-center gap-1.5 text-sm font-semibold text-white/85 transition-colors hover:text-white"
          >
            <UIcon :name="otherLocaleFlag" class="size-4" />
            {{ content.common.languageSwitch }}
          </NuxtLink>
          <UButton
            :to="business.phoneHref"
            icon="i-lucide-phone"
            size="xl"
            :aria-label="content.common.callChs"
            class="h-10 px-2 sm:px-5"
            :ui="{ leadingIcon: 'size-5' }"
          >
            <span class="hidden text-sm tracking-[1.5px] sm:inline">{{
              business.phoneDisplay
            }}</span>
          </UButton>
        </div>
      </UContainer>
    </header>

    <main class="flex flex-1 items-center py-12 sm:py-16">
      <UContainer
        class="grid items-center gap-12 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]"
      >
        <div>
          <p class="kicker mb-4 text-chs-400">{{ copy.kicker }}</p>
          <h1
            class="heading-display text-[clamp(44px,9vw,88px)] leading-[0.9] tracking-tight"
          >
            {{ copy.title[0] }}
            <em class="block text-primary not-italic">{{ copy.title[1] }}</em>
          </h1>
          <p class="mt-6 max-w-lg text-base text-zinc-300 sm:text-lg">
            {{ copy.text }}
          </p>
          <div class="mt-9 flex flex-col gap-3 sm:flex-row sm:gap-5">
            <UButton
              :to="business.phoneHref"
              icon="i-lucide-phone"
              size="xl"
              class="h-14 justify-center px-6"
            >
              {{ content.common.call(business.phoneDisplay) }}
            </UButton>
            <UButton
              :to="`mailto:${business.email}`"
              icon="i-lucide-mail"
              color="neutral"
              variant="outline"
              size="xl"
              class="h-14 justify-center bg-transparent px-6 text-white ring-2 ring-white hover:bg-white hover:text-ink-950"
            >
              {{ content.holding.email }}
            </UButton>
          </div>
          <OpenStatus class="mt-6" />
        </div>

        <ErrorGauge
          :reading="copy.reading"
          :unit="content.errorPage.gaugeUnit"
          :label="copy.gaugeLabel"
          :bar="mode === 'coming-soon' ? 250 : 0"
          :motion="mode === 'coming-soon' ? 'build' : 'drop'"
          class="mx-auto w-full max-w-[260px] drop-shadow-[0_24px_48px_rgba(229,16,31,0.25)] sm:max-w-[360px]"
        />
      </UContainer>
    </main>

    <footer class="border-t border-white/10 bg-ink-950/60 backdrop-blur-sm">
      <UContainer
        class="grid gap-6 py-7 text-sm sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]"
      >
        <div>
          <h2 class="kicker mb-2.5 text-[11px] text-chs-400">
            {{ content.holding.whatWeDo }}
          </h2>
          <ul class="flex flex-wrap gap-2">
            <li v-for="service in content.services" :key="service.slug">
              <UBadge
                :label="service.title"
                :icon="service.icon"
                color="neutral"
                variant="outline"
                size="lg"
                class="bg-transparent text-white ring-white/25"
              />
            </li>
          </ul>
        </div>
        <div>
          <h2 class="kicker mb-2.5 text-[11px] text-chs-400">
            {{ content.holding.email }}
          </h2>
          <a
            :href="`mailto:${business.email}`"
            class="font-semibold wrap-anywhere text-zinc-200 hover:text-white"
            >{{ business.email }}</a
          >
        </div>
        <div>
          <h2 class="kicker mb-2.5 text-[11px] text-chs-400">
            {{ content.holding.findUs }}
          </h2>
          <a
            :href="mapsUrl(business.address)"
            target="_blank"
            rel="noopener"
            class="not-italic text-zinc-200 hover:text-white"
          >
            <address class="not-italic">
              <template
                v-for="(line, i) in addressLines(business.address)"
                :key="line"
                ><br v-if="i" />{{ line }}</template
              >
            </address>
          </a>
        </div>
      </UContainer>
    </footer>
  </div>
</template>
