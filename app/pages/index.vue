<script setup lang="ts">
import { benefits } from "~/data/benefits";
import { sectors } from "~/data/sectors";
import { services } from "~/data/services";

const { business } = useAppConfig();

usePageSeo({
  title: "Hydraulic Repairs Llanelli & Carmarthenshire | CHS",
  description:
    "Hydraulic hose replacement, ram repairs, fault finding and mobile call-outs from Cross Hands, covering Llanelli, Carmarthenshire and South Wales.",
  path: "/",
});

const trust = [
  { icon: "i-lucide-zap", label: ["Fast", "turnaround"] },
  { icon: "i-lucide-wrench", label: ["On-site", "support"] },
  { icon: "i-lucide-shield-check", label: ["Quality", "you can trust"] },
];

const onsite = [
  "Emergency call-outs",
  "On-site hose replacement",
  "Hydraulic system diagnostics",
  "Plant, agricultural & commercial",
  "Flexible, reliable scheduling",
];

</script>

<template>
  <div>
    <section
      class="relative isolate overflow-hidden bg-ink-950 text-white"
      aria-labelledby="hero-title"
    >
      <NuxtPicture
        src="/images/hero.jpg"
        alt="Red hydraulic cylinder with polished ram and hoses"
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
            >Hydraulic repairs in Llanelli &amp; Carmarthenshire</span
          >
          Keeping <span class="block">industry</span>
          <em class="block text-primary not-italic">moving</em>
        </h1>
        <p class="mt-5 max-w-xl text-base text-zinc-200 sm:mt-7 sm:text-lg">
          Expert hydraulic repair, hose supply and on-site service for plant,
          agriculture, commercial and industrial customers across Llanelli,
          Carmarthenshire and South Wales.
        </p>

        <div
          class="mt-8 flex flex-col items-start justify-between gap-8 md:flex-row md:flex-wrap md:items-end"
        >
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
              Call now
            </UButton>
            <UButton
              to="#services"
              color="neutral"
              variant="outline"
              trailing-icon="i-lucide-chevron-right"
              size="xl"
              class="h-14 justify-center px-6 bg-transparent text-white ring-2 ring-white hover:bg-white hover:text-ink-950"
            >
              Our services
            </UButton>
          </div>

          <ul class="flex flex-wrap gap-x-8 gap-y-4" aria-label="Key benefits">
            <li
              v-for="item in trust"
              :key="item.icon"
              class="flex items-center gap-3 text-[11px] leading-snug font-extrabold tracking-wide uppercase sm:text-xs"
            >
              <UIcon :name="item.icon" class="size-8 text-chs-400 sm:size-9" />
              <span>{{ item.label[0] }}<br />{{ item.label[1] }}</span>
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
            <p class="kicker mb-3 text-chs-600">Our services</p>
            <h2
              id="services-title"
              class="heading-display max-w-2xl text-[clamp(30px,4vw,44px)]"
            >
              Complete hydraulic solutions
            </h2>
          </div>
          <div>
            <p class="mb-5 text-[15px] text-zinc-600">
              From emergency hose replacements to full system repairs, we keep
              your equipment running with minimal downtime.
            </p>
            <UButton
              to="/services"
              variant="link"
              color="neutral"
              trailing-icon="i-lucide-chevron-right"
              class="border-b-2 border-primary px-0 pb-1.5 text-[13px] text-ink-950 md:float-right"
              :ui="{ trailingIcon: 'text-primary' }"
            >
              View all services
            </UButton>
          </div>
        </div>
        <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <ServiceCard
            v-for="service in services"
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
        <p class="kicker mb-3 text-[11px] text-chs-400">Why choose CHS</p>
        <div
          class="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end"
        >
          <h2
            id="why-title"
            class="heading-display text-[clamp(32px,4.4vw,50px)]"
          >
            Minimum downtime.<br />Maximum support.
          </h2>
          <UButton
            to="/why-chs"
            variant="link"
            color="neutral"
            trailing-icon="i-lucide-chevron-right"
            class="border-b-2 border-primary px-0 pb-1.5 text-[13px] text-white hover:text-white/80"
            :ui="{ trailingIcon: 'text-chs-400' }"
          >
            Why choose CHS
          </UButton>
        </div>
        <ul
          class="mt-12 grid gap-y-8 sm:grid-cols-2 sm:gap-y-9 lg:grid-cols-4"
        >
          <li
            v-for="(item, i) in benefits"
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
          alt="CHS Crosshands Hydraulic Services mobile service van on site"
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
        <p class="kicker mb-3 text-chs-600">On-site hydraulic service</p>
        <h2
          id="onsite-title"
          class="heading-display mb-4 text-[clamp(30px,4vw,44px)]"
        >
          We come to you
        </h2>
        <p class="mb-6 text-[15px] text-zinc-600">
          Our fully equipped mobile service unit can carry out repairs, hose
          replacements and system diagnostics on-site, helping you avoid costly
          downtime.
        </p>
        <UButton
          :to="business.phoneHref"
          trailing-icon="i-lucide-chevron-right"
          size="xl"
        >
          Book a service
        </UButton>
      </div>
      <ul class="space-y-3.5 px-4 pb-12 sm:px-6 md:py-11 md:pl-0 lg:pr-6">
        <li
          v-for="item in onsite"
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
        <p class="kicker mb-3 text-white">Our sectors</p>
        <h2
          id="sectors-title"
          class="heading-display text-[clamp(22px,2.4vw,30px)] leading-[1.1]"
        >
          Proud to support
          <span class="block">a wide range of industries.</span>
        </h2>
        <NuxtLink
          to="/sectors"
          class="mt-5 inline-flex items-center gap-2 border-b-2 border-white pb-1.5 text-[13px] font-extrabold tracking-wider uppercase hover:border-white/70 hover:text-white/85"
        >
          View sectors <UIcon name="i-lucide-chevron-right" class="size-4" />
        </NuxtLink>
      </div>
      <ul
        class="grid grid-cols-2 items-center gap-x-3 gap-y-7 px-4 py-8 sm:grid-cols-3 sm:px-6 md:grid-cols-5 lg:py-8 lg:pr-[max(2rem,calc((100vw-var(--ui-container))/2+2rem))] lg:pl-5"
      >
        <li v-for="sector in sectors" :key="sector.slug">
          <NuxtLink
            :to="`/sectors#${sector.slug}`"
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

    <CtaBand />
  </div>
</template>
