<script setup lang="ts">
const content = useContent()
const localePath = useLocalePath()
const page = computed(() => content.value.sectorsPage)

usePageSeo({ ...page.value.seo, path: "/sectors" })
useBreadcrumbs([
  { name: content.value.common.home, path: "/" },
  { name: page.value.crumb, path: "/sectors" },
])

const crumbs = computed(() => [
  { label: content.value.common.home, to: localePath("/") },
  { label: page.value.crumb, class: "text-white" },
])

const sectorServices = (slugs: string[]) =>
  content.value.services.filter((s) => slugs.includes(s.slug))
</script>

<template>
  <div>
    <PageHero labelledby="sectors-title">
      <UBreadcrumb
        :items="crumbs"
        separator-icon="i-lucide-slash"
        :ui="heroBreadcrumbUi"
      />
      <h1
        id="sectors-title"
        class="heading-display text-[clamp(40px,6vw,76px)] leading-[0.95] tracking-tight"
      >
        {{ page.title[0] }}
        <em class="text-primary not-italic">{{ page.title[1] }}</em>
      </h1>
      <p class="mt-5 max-w-xl text-base text-zinc-200 sm:text-lg">
        {{ page.intro }}
      </p>
    </PageHero>

    <nav
      class="sticky top-(--ui-header-height) z-40 border-b border-zinc-200 bg-white/95 backdrop-blur-sm"
      :aria-label="page.navLabel"
    >
      <UContainer>
        <ul
          class="-mx-4 flex gap-1 overflow-x-auto px-4 py-3 [scrollbar-width:none] sm:mx-0 sm:px-0 lg:justify-center"
        >
          <li
            v-for="sector in content.sectors"
            :key="sector.slug"
            class="shrink-0"
          >
            <ULink
              raw
              :to="`#${sector.slug}`"
              class="flex items-center gap-2 px-3 py-2 text-[13px] font-extrabold tracking-wide whitespace-nowrap uppercase transition-colors hover:bg-zinc-100 hover:text-chs-600"
            >
              <UIcon :name="sector.icon" class="size-5 text-primary" />
              {{ sector.title }}
            </ULink>
          </li>
        </ul>
      </UContainer>
    </nav>

    <div class="divide-y divide-zinc-200">
      <section
        v-for="(sector, i) in content.sectors"
        :id="sector.slug"
        :key="sector.slug"
        class="scroll-mt-[calc(var(--ui-header-height)+4rem)] py-14 sm:py-18"
        :class="i % 2 === 1 && 'bg-zinc-100'"
        :aria-labelledby="`${sector.slug}-title`"
      >
        <UContainer
          class="grid gap-8 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:gap-14"
        >
          <div>
            <span
              class="mb-5 grid size-16 place-items-center bg-primary text-white"
            >
              <UIcon :name="sector.icon" class="size-9" />
            </span>
            <h2
              :id="`${sector.slug}-title`"
              class="heading-display mb-4 text-[clamp(26px,3.4vw,38px)]"
            >
              {{ sector.title }}
            </h2>
            <p class="max-w-2xl text-[17px] text-zinc-600">
              {{ sector.summary }}
            </p>

            <div class="mt-7">
              <h3 class="heading-display mb-3 text-[13px] tracking-wide">
                {{ page.servicesForSector }}
              </h3>
              <ul class="flex flex-wrap gap-2.5">
                <li
                  v-for="service in sectorServices(sector.services)"
                  :key="service.slug"
                >
                  <UButton
                    :to="localePath(`/services/${service.slug}`)"
                    color="neutral"
                    variant="outline"
                    :icon="service.icon"
                    trailing-icon="i-lucide-chevron-right"
                    class="bg-white text-xs text-ink-950 ring-zinc-300 hover:bg-ink-950 hover:text-white"
                    :ui="{ leadingIcon: 'text-primary' }"
                  >
                    {{ service.title }}
                  </UButton>
                </li>
              </ul>
            </div>
          </div>

          <div
            class="self-start border-t-3 border-primary bg-white p-6 shadow-[0_10px_30px_rgba(15,22,26,0.08)] sm:p-7"
          >
            <h3 class="heading-display mb-4 text-[13px] tracking-wide">
              {{
                sector.slug === "more" ? page.otherWork : page.typicalMachines
              }}
            </h3>
            <ul class="space-y-3">
              <li
                v-for="machine in sector.machines"
                :key="machine"
                class="flex items-center gap-3 text-[15px] font-semibold"
              >
                <span
                  class="grid size-5.5 shrink-0 place-items-center rounded-full bg-primary text-white"
                >
                  <UIcon name="i-lucide-check" class="size-3.5" />
                </span>
                {{ machine }}
              </li>
            </ul>
          </div>
        </UContainer>
      </section>
    </div>

    <CtaBand
      :kicker="page.cta.kicker"
      :title="page.cta.title"
      :text="page.cta.text"
    />
  </div>
</template>
