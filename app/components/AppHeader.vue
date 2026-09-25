<script setup lang="ts">
const { business } = useAppConfig()
const route = useRoute()
const content = useContent()
const localePath = useLocalePath()
const switchLocalePath = useSwitchLocalePath()
const { locale } = useI18n()

const links = computed(() => {
  const { nav } = content.value
  return [
    { id: "home", label: nav.home, to: localePath("/") },
    { id: "services", label: nav.services, to: localePath("/services") },
    { id: "about", label: nav.about, to: localePath("/about") },
    { id: "sectors", label: nav.sectors, to: localePath("/sectors") },
    { id: "why-chs", label: nav.whyChs, to: localePath("/why-chs") },
    { id: "contact", label: nav.contact, to: localePath("/contact") },
  ]
})

function isCurrent(to: string) {
  if (to === localePath("/")) return route.path === to
  return route.path === to || route.path.startsWith(`${to}/`)
}

// Language switcher: the same page in the other language. Uses NuxtLink, not ULink:
// ULink localises paths itself, which would re-prefix the other language's URL.
const otherLocale = computed(() => (locale.value === "en" ? "cy" : "en"))
const otherLocaleFlag = computed(() =>
  otherLocale.value === "cy" ? "i-circle-flags-gb-wls" : "i-circle-flags-gb",
)
const otherLocaleTag = computed(() =>
  otherLocale.value === "cy" ? "cy-GB" : "en-GB",
)

// Desktop nav indicator: one red bar that sits under the current page's link and glides to
// whichever link is hovered or focused, returning when the pointer leaves the menu.
const items = ref<HTMLLIElement[]>([])
const hovered = ref<number | null>(null)
const activeIndex = computed(() =>
  links.value.findIndex((link) => isCurrent(link.to)),
)
const target = computed(() => hovered.value ?? activeIndex.value)
const bar = ref({ left: 0, width: 0 })
// Until the links are measured (server render, first paint) the current link draws its own
// underline; transitions switch on only after the bar is placed, so it doesn't slide in on load.
const measured = ref(false)
const animate = ref(false)

function placeBar() {
  const el = items.value[target.value]
  if (el) bar.value = { left: el.offsetLeft, width: el.offsetWidth }
}

// Re-place on a new target, and when the links change (switching language changes every
// label's width while the current item's index can stay the same).
watch([target, links], () => nextTick(placeBar))

// Re-measure whenever a link changes size: the nav appearing at the desktop breakpoint,
// window resizes, text reflow.
let resizeObserver: ResizeObserver | undefined
onMounted(() => {
  placeBar()
  measured.value = true
  requestAnimationFrame(() => {
    animate.value = true
  })
  resizeObserver = new ResizeObserver(placeBar)
  items.value.forEach((el) => resizeObserver!.observe(el))
})
onBeforeUnmount(() => resizeObserver?.disconnect())
</script>

<template>
  <UHeader
    :to="localePath('/')"
    mode="slideover"
    toggle-side="right"
    :toggle="{
      color: 'neutral',
      variant: 'outline',
      size: 'xl',
      class: 'text-white ring-white ring-2 bg-transparent hover:bg-white/10',
    }"
    :menu="{ side: 'right' }"
    :ui="{
      root: 'bg-ink-950 border-b-0 backdrop-blur-none',
      left: 'lg:flex-none',
      center: 'lg:flex-1 justify-center',
      right: 'lg:flex-none',
      content: 'bg-ink-950 text-white',
      header: 'border-b border-white/10',
      body: 'p-0',
    }"
  >
    <template #title>
      <NuxtPicture
        src="/images/chs-logo-white.png"
        alt="CHS Crosshands Hydraulic Services"
        sizes="120px"
        width="120"
        densities="x1 x2"
        format="avif,webp"
        :img-attrs="{ class: 'h-auto w-[80px] sm:w-[100px] lg:w-[120px]' }"
      />
    </template>

    <nav :aria-label="content.common.primaryNav">
      <ul
        class="relative flex gap-5 xl:gap-8"
        @mouseleave="hovered = null"
        @focusout="hovered = null"
      >
        <li
          v-for="(link, i) in links"
          :key="link.id"
          ref="items"
          @mouseenter="hovered = i"
          @focusin="hovered = i"
        >
          <ULink
            :to="link.to"
            :active="isCurrent(link.to)"
            :aria-current="isCurrent(link.to) ? 'page' : undefined"
            class="relative block py-2 text-[15px] font-medium transition-colors hover:text-white"
            :active-class="
              measured
                ? 'text-white'
                : 'text-white after:absolute after:inset-x-0 after:bottom-0 after:h-0.75 after:bg-primary'
            "
            inactive-class="text-white/85"
          >
            {{ link.label }}
          </ULink>
        </li>
        <li
          aria-hidden="true"
          class="pointer-events-none absolute bottom-0 left-0 h-0.75 bg-primary"
          :class="[
            animate &&
              'transition-[translate,width,opacity] duration-300 ease-out motion-reduce:transition-none',
            measured && target >= 0 ? 'opacity-100' : 'opacity-0',
          ]"
          :style="{ width: `${bar.width}px`, translate: `${bar.left}px 0` }"
        />
      </ul>
    </nav>

    <template #right>
      <NuxtLink
        :to="switchLocalePath(otherLocale)"
        :lang="otherLocaleTag"
        :hreflang="otherLocaleTag"
        :aria-label="content.common.languageSwitchLabel"
        class="me-2 hidden items-center gap-1.5 text-sm font-semibold text-white/85 transition-colors hover:text-white md:inline-flex"
      >
        <UIcon :name="otherLocaleFlag" class="size-4" />
        {{ content.common.languageSwitch }}
      </NuxtLink>
      <UButton
        :to="business.phoneHref"
        icon="i-lucide-phone"
        size="xl"
        :aria-label="content.common.callChs"
        class="h-10 lg:h-14 px-2 sm:px-5"
      >
        <span class="hidden flex-col text-left leading-tight sm:flex">
          <span class="text-[13px] tracking-[2px] lg:text-[17px]">{{
            content.common.callNow
          }}</span>
          <span class="text-xs tracking-[1.5px] lg:text-sm">{{
            business.phoneDisplay
          }}</span>
        </span>
      </UButton>
    </template>

    <template #body>
      <nav :aria-label="content.common.mobileNav">
        <ul class="divide-y divide-white/10">
          <li v-for="link in links" :key="link.id">
            <ULink
              :to="link.to"
              :active="isCurrent(link.to)"
              :aria-current="isCurrent(link.to) ? 'page' : undefined"
              class="block border-l-3 px-5 py-4 text-[17px] font-medium transition-colors hover:bg-white/5 hover:text-white"
              active-class="border-primary text-white"
              inactive-class="border-transparent text-white/85"
            >
              {{ link.label }}
            </ULink>
          </li>
        </ul>
      </nav>
      <div class="space-y-4 p-5">
        <UButton :to="business.phoneHref" icon="i-lucide-phone" size="xl" block>
          {{ content.common.call(business.phoneDisplay) }}
        </UButton>
        <NuxtLink
          :to="switchLocalePath(otherLocale)"
          :lang="otherLocaleTag"
          :hreflang="otherLocaleTag"
          :aria-label="content.common.languageSwitchLabel"
          class="flex items-center justify-center gap-2 py-2 font-semibold text-white/85 hover:text-white"
        >
          <UIcon :name="otherLocaleFlag" class="size-5" />
          {{ content.common.languageSwitch }}
        </NuxtLink>
      </div>
    </template>
  </UHeader>
</template>
