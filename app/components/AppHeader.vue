<script setup lang="ts">
const { business } = useAppConfig()
const route = useRoute()

const links = [
  { label: "Home", to: "/" },
  { label: "Services", to: "/services" },
  { label: "About", to: "/about" },
  { label: "Sectors", to: "/sectors" },
  { label: "Why CHS", to: "/why-chs" },
  { label: "Contact", to: "/contact" },
]

function isCurrent(to: string) {
  if (to === "/") return route.path === "/"
  return route.path === to || route.path.startsWith(`${to}/`)
}

// Desktop nav indicator: one red bar that sits under the current page's link and glides to
// whichever link is hovered or focused, returning when the pointer leaves the menu.
const items = ref<HTMLLIElement[]>([])
const hovered = ref<number | null>(null)
const activeIndex = computed(() =>
  links.findIndex((link) => isCurrent(link.to)),
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

watch(target, () => nextTick(placeBar))

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
    to="/"
    mode="slideover"
    toggle-side="right"
    :toggle="{
      color: 'neutral',
      variant: 'outline',
      size: 'xl',
      class: 'text-white ring-white/25 hover:bg-white/10',
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
        sizes="150px"
        width="150"
        densities="x1 x2"
        format="avif,webp"
        :img-attrs="{ class: 'h-auto w-[108px] sm:w-[130px] lg:w-[150px]' }"
      />
    </template>

    <nav aria-label="Primary navigation">
      <ul
        class="relative flex gap-8"
        @mouseleave="hovered = null"
        @focusout="hovered = null"
      >
        <li
          v-for="(link, i) in links"
          :key="link.to"
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
      <UButton
        :to="business.phoneHref"
        icon="i-lucide-phone"
        size="xl"
        aria-label="Call CHS Hydraulic Services"
        class="h-12 px-3 sm:px-5 lg:h-16"
      >
        <span class="hidden flex-col text-left leading-tight sm:flex">
          <span class="text-[13px] tracking-[2px] lg:text-[17px]"
            >Call now</span
          >
          <span class="text-xs tracking-[1.5px] lg:text-sm">{{
            business.phoneDisplay
          }}</span>
        </span>
      </UButton>
    </template>

    <template #body>
      <nav aria-label="Mobile navigation">
        <ul class="divide-y divide-white/10">
          <li v-for="link in links" :key="link.to">
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
      <div class="p-5">
        <UButton :to="business.phoneHref" icon="i-lucide-phone" size="xl" block>
          Call {{ business.phoneDisplay }}
        </UButton>
      </div>
    </template>
  </UHeader>
</template>
