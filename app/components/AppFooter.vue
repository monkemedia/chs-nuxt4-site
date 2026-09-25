<script setup lang="ts">
const { business } = useAppConfig()
const content = useContent()
const localePath = useLocalePath()

const columns = computed(() => {
  const { footer, nav, services } = content.value
  return [
    {
      id: "footer-services",
      title: footer.services,
      links: services.map((s) => ({
        label: s.h1,
        to: localePath(`/services/${s.slug}`),
      })),
    },
    {
      id: "footer-explore",
      title: footer.explore,
      links: [
        { label: footer.allServices, to: localePath("/services") },
        { label: footer.aboutUs, to: localePath("/about") },
        { label: nav.sectors, to: localePath("/sectors") },
        { label: nav.whyChs, to: localePath("/why-chs") },
        { label: nav.contact, to: localePath("/contact") },
      ],
    },
  ]
})

const linkClass = "transition-colors hover:text-white focus-visible:text-white"
</script>

<template>
  <footer class="bg-ink-950 text-sm text-zinc-400">
    <UContainer
      class="grid gap-8 py-12 sm:grid-cols-2 lg:grid-cols-[1.3fr_1.2fr_0.8fr_1fr]"
    >
      <div class="sm:col-span-2 lg:col-span-1">
        <NuxtPicture
          src="/images/chs-logo-white.png"
          alt="CHS Crosshands Hydraulic Services"
          sizes="130px"
          width="130"
          height="64"
          densities="x1 x2"
          format="avif,webp"
          loading="lazy"
          :img-attrs="{ class: 'h-auto w-[130px]' }"
        />
        <p class="mt-4 max-w-xs">{{ content.footer.blurb }}</p>
      </div>

      <nav
        v-for="column in columns"
        :key="column.id"
        :aria-labelledby="column.id"
      >
        <h2
          :id="column.id"
          class="heading-display mb-3.5 text-[13px] tracking-[1.5px] text-white"
        >
          {{ column.title }}
        </h2>
        <ul class="space-y-2">
          <li v-for="link in column.links" :key="link.to">
            <ULink raw :to="link.to" :class="linkClass">{{ link.label }}</ULink>
          </li>
        </ul>
      </nav>

      <div>
        <h2
          class="heading-display mb-3.5 text-[13px] tracking-[1.5px] text-white"
        >
          {{ content.footer.getInTouch }}
        </h2>
        <ul class="space-y-2 wrap-anywhere">
          <li>
            <a :href="business.phoneHref" :class="linkClass">{{
              business.phoneDisplay
            }}</a>
          </li>
          <li>
            <a :href="`mailto:${business.email}`" :class="linkClass">{{
              business.email
            }}</a>
          </li>
          <li>{{ content.business.location }}</li>
        </ul>
      </div>
    </UContainer>

    <UContainer>
      <USeparator :ui="{ border: 'border-white/10' }" />
      <p class="py-6 text-xs">
        © {{ new Date().getFullYear() }} {{ business.name }}.
      </p>
    </UContainer>
  </footer>
</template>
