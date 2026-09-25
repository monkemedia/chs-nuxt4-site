<script setup lang="ts">
const { business } = useAppConfig()
const content = useContent()
const localePath = useLocalePath()

usePageSeo({ ...content.value.home.seo, path: "/" })

const trustIcons = ["i-lucide-zap", "i-lucide-wrench", "i-lucide-shield-check"]
</script>

<template>
  <div>
    <section
      class="relative isolate overflow-hidden bg-ink-950 text-white"
      aria-labelledby="hero-title"
    >
      <NuxtPicture
        src="/images/hero.jpg"
        :alt="content.home.heroImageAlt"
        sizes="524px"
        width="524"
        height="328"
        densities="x1"
        format="avif,webp"
        :preload="{ fetchPriority: 'high' }"
        :img-attrs="{
          fetchpriority: 'high',
          class:
            'absolute inset-y-0 right-0 -z-20 h-full w-full object-cover object-[60%_center] lg:w-[68%]',
        }"
      />
      <div
        class="absolute inset-0 -z-10 bg-linear-to-r from-ink-950/95 via-ink-950/75 to-ink-950/35 lg:from-ink-950 lg:from-30% lg:via-ink-950/80 lg:via-45% lg:to-ink-950/10"
        aria-hidden="true"
      />
      <div
        class="absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-linear-to-t from-ink-950/90 to-transparent"
        aria-hidden="true"
      />

      <UContainer class="pt-12 pb-8 sm:pt-16 lg:pt-22 lg:pb-9">
        <h1
          id="hero-title"
          class="heading-display text-[clamp(44px,7.2vw,96px)] leading-[0.92] tracking-tight"
        >
          <span
            class="kicker mb-4.5 block font-sans leading-normal tracking-[1.5px] sm:mb-6.5 sm:tracking-[3px]"
            >{{ content.home.heroKicker }}</span
          >
          {{ content.home.heroTitle[0] }}
          <span class="block">{{ content.home.heroTitle[1] }}</span>
          <em class="block text-primary not-italic">{{
            content.home.heroTitle[2]
          }}</em>
        </h1>
        <p class="mt-5 max-w-xl text-base text-zinc-200 sm:mt-7 sm:text-lg">
          {{ content.home.heroCopy }}
        </p>

        <div
          class="mt-8 flex flex-col items-start justify-between gap-8 md:flex-row md:flex-wrap md:items-end"
        >
          <div class="flex w-full flex-col gap-5 sm:w-auto">
            <div
              class="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:gap-5"
            >
              <UButton
                :to="business.phoneHref"
                icon="i-lucide-phone"
                trailing-icon="i-lucide-chevron-right"
                size="xl"
                class="h-14 justify-center px-6"
              >
                {{ content.common.callNow }}
              </UButton>
              <UButton
                to="#services"
                color="neutral"
                variant="outline"
                trailing-icon="i-lucide-chevron-right"
                size="xl"
                class="h-14 justify-center px-6 bg-transparent text-white ring-2 ring-white hover:bg-white hover:text-ink-950"
              >
                {{ content.common.ourServices }}
              </UButton>
            </div>
            <GoogleRatingBadge />
          </div>

          <ul
            class="flex flex-wrap gap-x-8 gap-y-4"
            :aria-label="content.home.keyBenefits"
          >
            <li
              v-for="(label, i) in content.home.trust"
              :key="trustIcons[i]"
              class="flex items-center gap-3 text-[11px] leading-snug font-extrabold tracking-wide uppercase sm:text-xs"
            >
              <UIcon
                :name="trustIcons[i]!"
                class="size-8 text-chs-400 sm:size-9"
              />
              <span>{{ label[0] }}<br />{{ label[1] }}</span>
            </li>
          </ul>
        </div>
      </UContainer>
    </section>

    <section
      id="services"
      class="py-16 sm:py-20"
      aria-labelledby="services-title"
    >
      <UContainer>
        <div
          class="mb-9 grid items-end gap-8 md:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] md:gap-15"
        >
          <div>
            <p class="kicker mb-3 text-chs-600">
              {{ content.common.ourServices }}
            </p>
            <h2
              id="services-title"
              class="heading-display max-w-2xl text-[clamp(30px,4vw,44px)]"
            >
              {{ content.home.servicesTitle }}
            </h2>
          </div>
          <div>
            <p class="mb-5 text-[15px] text-zinc-600">
              {{ content.home.servicesIntro }}
            </p>
            <UButton
              :to="localePath('/services')"
              variant="link"
              color="neutral"
              trailing-icon="i-lucide-chevron-right"
              class="border-b-2 border-primary px-0 pb-1.5 text-[13px] text-ink-950 md:float-right"
              :ui="{ trailingIcon: 'text-primary' }"
            >
              {{ content.common.viewAllServices }}
            </UButton>
          </div>
        </div>
        <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <ServiceCard
            v-for="service in content.services"
            :key="service.slug"
            :service="service"
          />
        </div>
      </UContainer>
    </section>

    <section
      id="why"
      class="relative isolate overflow-hidden bg-ink-900 py-18 text-white"
      aria-labelledby="why-title"
    >
      <div
        class="absolute inset-y-0 right-0 -z-10 w-full bg-[url('/images/why-bg.jpg')] bg-cover bg-right lg:w-[62%] lg:bg-center"
        aria-hidden="true"
      >
        <div
          class="size-full bg-linear-to-r from-ink-900/95 to-ink-900/70 lg:from-ink-900 lg:via-ink-900/45 lg:to-ink-900/30"
        />
      </div>
      <UContainer>
        <p class="kicker mb-3 text-[11px] text-chs-400">
          {{ content.home.whyKicker }}
        </p>
        <div
          class="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end"
        >
          <h2
            id="why-title"
            class="heading-display text-[clamp(32px,4.4vw,50px)]"
          >
            {{ content.home.whyTitle[0] }}<br />{{ content.home.whyTitle[1] }}
          </h2>
          <UButton
            :to="localePath('/why-chs')"
            variant="link"
            color="neutral"
            trailing-icon="i-lucide-chevron-right"
            class="border-b-2 border-primary px-0 pb-1.5 text-[13px] text-white hover:text-white/80"
            :ui="{ trailingIcon: 'text-chs-400' }"
          >
            {{ content.home.whyLink }}
          </UButton>
        </div>
        <ul class="mt-12 grid gap-y-8 sm:grid-cols-2 sm:gap-y-9 lg:grid-cols-4">
          <li
            v-for="(item, i) in content.benefits"
            :key="item.title.join(' ')"
            class="grid grid-cols-[44px_1fr] content-start items-center gap-x-3.5 border-white/20 sm:px-5 lg:border-l lg:px-7 lg:first:border-l-0 lg:first:pl-0"
            :class="i % 2 === 1 ? 'sm:border-l' : 'sm:pl-0'"
          >
            <UIcon :name="item.icon" class="size-10 text-chs-400" />
            <strong
              class="text-[15px] leading-tight font-extrabold tracking-wide uppercase"
            >
              {{ item.title[0] }}<br />{{ item.title[1] }}
            </strong>
            <p class="col-start-2 mt-3.5 text-sm text-zinc-300">
              {{ item.summary }}
            </p>
          </li>
        </ul>
      </UContainer>
    </section>

    <section
      id="onsite"
      class="grid items-center bg-zinc-100 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)_minmax(0,0.72fr)]"
      aria-labelledby="onsite-title"
    >
      <div class="self-stretch md:col-span-2 lg:col-span-1">
        <NuxtPicture
          src="/images/van.jpg"
          :alt="content.home.vanAlt"
          sizes="444px"
          width="444"
          height="200"
          densities="x1"
          format="avif,webp"
          loading="lazy"
          :img-attrs="{
            class: 'size-full min-h-75 max-h-105 object-cover lg:max-h-none',
          }"
        />
      </div>
      <div class="px-4 pt-11 pb-2 sm:px-6 md:py-11 lg:px-10">
        <p class="kicker mb-3 text-chs-600">
          {{ content.home.onsiteKicker }}
        </p>
        <h2
          id="onsite-title"
          class="heading-display mb-4 text-[clamp(30px,4vw,44px)]"
        >
          {{ content.home.onsiteTitle }}
        </h2>
        <p class="mb-6 text-[15px] text-zinc-600">
          {{ content.home.onsiteText }}
        </p>
        <UButton
          :to="business.phoneHref"
          trailing-icon="i-lucide-chevron-right"
          size="xl"
        >
          {{ content.home.bookService }}
        </UButton>
      </div>
      <ul class="space-y-3.5 px-4 pb-12 sm:px-6 md:py-11 md:pl-0 lg:pr-6">
        <li
          v-for="item in content.home.onsiteList"
          :key="item"
          class="flex items-center gap-3 text-sm"
        >
          <span
            class="grid size-5.5 shrink-0 place-items-center rounded-full bg-primary text-white"
          >
            <UIcon name="i-lucide-check" class="size-3.5" />
          </span>
          {{ item }}
        </li>
      </ul>
    </section>

    <section
      id="sectors"
      class="grid bg-ink-900 text-white lg:grid-cols-[minmax(0,42%)_minmax(0,1fr)]"
      aria-labelledby="sectors-title"
    >
      <div
        class="bg-primary px-4 py-9 sm:px-6 lg:py-11 lg:pr-22 lg:pl-[max(2rem,calc((100vw-var(--ui-container))/2+2rem))] lg:[clip-path:polygon(0_0,100%_0,calc(100%-56px)_100%,0_100%)]"
      >
        <p class="kicker mb-3 text-white">{{ content.home.sectorsKicker }}</p>
        <h2
          id="sectors-title"
          class="heading-display text-[clamp(22px,2.4vw,30px)] leading-[1.1]"
        >
          {{ content.home.sectorsTitle[0] }}
          <span class="block">{{ content.home.sectorsTitle[1] }}</span>
        </h2>
        <NuxtLink
          :to="localePath('/sectors')"
          class="mt-5 inline-flex items-center gap-2 border-b-2 border-white pb-1.5 text-[13px] font-extrabold tracking-wider uppercase hover:border-white/70 hover:text-white/85"
        >
          {{ content.home.viewSectors }}
          <UIcon name="i-lucide-chevron-right" class="size-4" />
        </NuxtLink>
      </div>
      <ul
        class="grid grid-cols-2 items-center gap-x-3 gap-y-7 px-4 py-8 sm:grid-cols-3 sm:px-6 md:grid-cols-5 lg:py-8 lg:pr-[max(2rem,calc((100vw-var(--ui-container))/2+2rem))] lg:pl-5"
      >
        <li v-for="sector in content.sectors" :key="sector.slug">
          <NuxtLink
            :to="`${localePath('/sectors')}#${sector.slug}`"
            class="group flex flex-col items-center gap-3.5 text-center text-[11.5px] leading-snug font-extrabold tracking-wide uppercase transition-colors hover:text-chs-400"
          >
            <UIcon
              :name="sector.icon"
              class="size-11 transition-transform group-hover:-translate-y-0.5"
            />
            <span
              >{{ sector.label[0]
              }}<template v-if="sector.label[1]"
                ><br />{{ sector.label[1] }}</template
              ></span
            >
          </NuxtLink>
        </li>
      </ul>
    </section>

    <ReviewsSection />

    <CtaBand />
  </div>
</template>
