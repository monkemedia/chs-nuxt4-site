<script setup lang="ts">
const content = useContent()
const localePath = useLocalePath()
const page = computed(() => content.value.about)

usePageSeo({ ...page.value.seo, path: "/about" })
useBreadcrumbs([
  { name: content.value.common.home, path: "/" },
  { name: page.value.crumb, path: "/about" },
])

const crumbs = computed(() => [
  { label: content.value.common.home, to: localePath("/") },
  { label: page.value.crumb, class: "text-white" },
])
</script>

<template>
  <div>
    <PageHero labelledby="about-title">
      <UBreadcrumb
        :items="crumbs"
        separator-icon="i-lucide-slash"
        :ui="heroBreadcrumbUi"
      />
      <h1
        id="about-title"
        class="heading-display text-[clamp(40px,6vw,76px)] leading-[0.95] tracking-tight"
      >
        {{ page.title[0] }}
        <em class="text-primary not-italic">{{ page.title[1] }}</em>
      </h1>
      <p class="mt-5 max-w-xl text-base text-zinc-200 sm:text-lg">
        {{ page.intro }}
      </p>
    </PageHero>

    <section class="py-16 sm:py-20" aria-labelledby="who-title">
      <UContainer class="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div>
          <p class="kicker mb-3 text-chs-600">{{ page.whoKicker }}</p>
          <h2
            id="who-title"
            class="heading-display mb-6 text-[clamp(28px,3.6vw,40px)]"
          >
            {{ page.whoTitle }}
          </h2>
          <div class="space-y-4 text-zinc-600">
            <p
              v-for="(paragraph, i) in page.who"
              :key="i"
              :class="{ 'text-[17px] text-ink-950 sm:text-[19px]': i === 0 }"
            >
              {{ paragraph }}
            </p>
          </div>
        </div>
        <NuxtPicture
          src="/images/van.jpg"
          :alt="page.vanAlt"
          sizes="444px"
          width="444"
          height="200"
          densities="x1"
          format="avif,webp"
          loading="lazy"
          :img-attrs="{
            class:
              'aspect-[444/250] w-full object-cover shadow-[0_10px_30px_rgba(15,22,26,0.12)]',
          }"
        />
      </UContainer>
    </section>

    <section class="bg-ink-900 text-white" :aria-label="page.factsLabel">
      <UContainer>
        <dl class="grid grid-cols-2 divide-white/15 lg:grid-cols-4 lg:divide-x">
          <div
            v-for="fact in page.facts"
            :key="fact.label"
            class="px-2 py-8 lg:px-8 lg:first:pl-0"
          >
            <dt class="kicker text-[11px] text-chs-400">{{ fact.label }}</dt>
            <dd class="heading-display mt-2 text-2xl sm:text-3xl">
              {{ fact.value }}
            </dd>
          </div>
        </dl>
      </UContainer>
    </section>

    <section class="py-16 sm:py-20" aria-labelledby="values-title">
      <UContainer>
        <p class="kicker mb-3 text-chs-600">{{ page.valuesKicker }}</p>
        <h2
          id="values-title"
          class="heading-display mb-10 text-[clamp(28px,3.6vw,40px)]"
        >
          {{ page.valuesTitle }}
        </h2>
        <ul class="grid gap-5 md:grid-cols-3">
          <li
            v-for="value in page.values"
            :key="value.title"
            class="border-t-3 border-primary bg-zinc-100 p-6 sm:p-7"
          >
            <UIcon :name="value.icon" class="size-9 text-primary" />
            <h3 class="heading-display mt-4 mb-2 text-lg">{{ value.title }}</h3>
            <p class="text-sm text-zinc-600">{{ value.text }}</p>
          </li>
        </ul>
      </UContainer>
    </section>

    <section class="bg-zinc-100 py-16 sm:py-20" aria-labelledby="ways-title">
      <UContainer>
        <p class="kicker mb-3 text-chs-600">{{ page.waysKicker }}</p>
        <h2
          id="ways-title"
          class="heading-display mb-10 text-[clamp(28px,3.6vw,40px)]"
        >
          {{ page.waysTitle }}
        </h2>
        <div class="grid gap-5 md:grid-cols-2">
          <article
            v-for="way in page.ways"
            :key="way.title"
            class="flex flex-col bg-white p-6 shadow-[0_10px_30px_rgba(15,22,26,0.08)] sm:p-8"
          >
            <span class="grid size-14 place-items-center bg-primary text-white">
              <UIcon :name="way.icon" class="size-7" />
            </span>
            <h3 class="heading-display mt-5 mb-3 text-xl">{{ way.title }}</h3>
            <p class="mb-6 flex-1 text-zinc-600">{{ way.text }}</p>
            <ULink
              raw
              :to="localePath(way.link.to)"
              class="inline-flex items-center gap-2 self-start border-b-2 border-primary pb-1 text-[13px] font-extrabold tracking-wider uppercase hover:text-chs-600"
            >
              {{ way.link.label }}
              <UIcon
                name="i-lucide-chevron-right"
                class="size-4 text-primary"
              />
            </ULink>
          </article>
        </div>
      </UContainer>
    </section>

    <section class="py-16 sm:py-20" aria-labelledby="areas-title">
      <UContainer
        class="grid items-center gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]"
      >
        <div>
          <p class="kicker mb-3 text-chs-600">{{ page.areasKicker }}</p>
          <h2
            id="areas-title"
            class="heading-display mb-4 text-[clamp(28px,3.6vw,40px)]"
          >
            {{ page.areasTitle }}
          </h2>
          <p class="text-zinc-600">
            {{ page.areasText }}
          </p>
        </div>
        <ul class="flex flex-wrap gap-2.5">
          <li v-for="area in content.business.serviceArea" :key="area">
            <UBadge
              :label="area"
              color="neutral"
              variant="outline"
              size="xl"
              icon="i-lucide-map-pin"
              class="bg-white text-ink-950 ring-zinc-300"
              :ui="{ leadingIcon: 'text-primary' }"
            />
          </li>
        </ul>
      </UContainer>
    </section>

    <CtaBand />
  </div>
</template>
