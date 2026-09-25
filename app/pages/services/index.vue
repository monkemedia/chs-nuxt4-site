<script setup lang="ts">
import { services } from '~/data/services'

const { business } = useAppConfig()

usePageSeo({
  title: 'Hydraulic Services Llanelli & Carmarthenshire | CHS',
  description: 'Hose replacement, ram and cylinder repairs, fault finding and mobile on-site service from our Cross Hands workshop, covering Llanelli and Carmarthenshire.',
  path: '/services'
})
useBreadcrumbs([
  { name: 'Home', path: '/' },
  { name: 'Services', path: '/services' }
])
</script>

<template>
  <div>
    <PageHero labelledby="services-title">
      <nav class="breadcrumbs" aria-label="Breadcrumb">
        <ol>
          <li><NuxtLink to="/">Home</NuxtLink></li>
          <li><span aria-current="page">Services</span></li>
        </ol>
      </nav>
      <h1 id="services-title">Hydraulic <em>services</em></h1>
      <p class="page-hero-copy">Hose replacement, ram repairs, fault finding and mobile call-outs from our workshop in Cross Hands, serving Llanelli, Carmarthenshire and South Wales.</p>
    </PageHero>

    <section class="section services" aria-label="Our services">
      <div class="container">
        <div class="service-grid">
          <ServiceCard v-for="service in services" :key="service.slug" :service="service" heading-level="h2" />
        </div>
      </div>
    </section>

    <section class="cta" aria-labelledby="cta-title">
      <div class="container cta-inner">
        <div>
          <p class="kicker">Not sure what you need?</p>
          <h2 id="cta-title">Tell us what's happening.</h2>
          <p>Describe the problem and we'll point you in the right direction.</p>
        </div>
        <div class="cta-actions">
          <a class="button button-red" :href="business.phoneHref"><AppIcon name="phone" class="icon-fill" /> {{ business.phoneDisplay }}</a>
          <NuxtLink class="button button-outline" to="/contact">Send an enquiry <AppIcon name="chevron" /></NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>
