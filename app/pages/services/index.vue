<script setup lang="ts">
import { services } from '~/data/services'

usePageSeo({
  title: 'Hydraulic Services Llanelli & Carmarthenshire | CHS',
  description: 'Hose replacement, ram and cylinder repairs, fault finding and mobile on-site service from our Cross Hands workshop, covering Llanelli and Carmarthenshire.',
  path: '/services'
})
useBreadcrumbs([
  { name: 'Home', path: '/' },
  { name: 'Services', path: '/services' }
])

const crumbs = [
  { label: 'Home', to: '/' },
  { label: 'Services', class: 'text-white' }
]
</script>

<template>
  <div>
    <PageHero labelledby="services-title">
      <UBreadcrumb :items="crumbs" separator-icon="i-lucide-slash" :ui="heroBreadcrumbUi" />
      <h1 id="services-title" class="heading-display text-[clamp(40px,6vw,76px)] leading-[0.95] tracking-tight">
        Hydraulic <em class="text-primary not-italic">services</em>
      </h1>
      <p class="mt-5 max-w-xl text-base text-zinc-200 sm:text-lg">
        Hose replacement, ram repairs, fault finding and mobile call-outs from our workshop in Cross Hands, serving Llanelli, Carmarthenshire and South Wales.
      </p>
    </PageHero>

    <section class="py-16 sm:py-20" aria-label="Our services">
      <UContainer>
        <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <ServiceCard v-for="service in services" :key="service.slug" :service="service" heading-level="h2" />
        </div>
      </UContainer>
    </section>

    <CtaBand kicker="Not sure what you need?" title="Tell us what's happening." text="Describe the problem and we'll point you in the right direction." />
  </div>
</template>
