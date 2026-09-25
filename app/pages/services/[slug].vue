<script setup lang="ts">
import { findService, services } from '~/data/services'

const route = useRoute()
const { business } = useAppConfig()
const service = findService(String(route.params.slug))
if (!service) throw createError({ statusCode: 404, statusMessage: 'Service not found', fatal: true })

const path = `/services/${service.slug}`
const others = services.filter(s => s.slug !== service.slug)

usePageSeo({ title: service.metaTitle, description: service.metaDescription, path })
useBreadcrumbs([
  { name: 'Home', path: '/' },
  { name: 'Services', path: '/services' },
  { name: service.title, path }
])
useJsonLd('service', {
  '@type': 'Service',
  name: service.h1,
  serviceType: service.title,
  description: service.metaDescription,
  url: new URL(path, useSiteConfig().url).href,
  provider: { '@id': useBusinessId() },
  areaServed: business.towns.map(name => ({ '@type': 'City', name }))
})
</script>

<template>
  <div>
    <PageHero labelledby="service-title">
      <nav class="breadcrumbs" aria-label="Breadcrumb">
        <ol>
          <li><NuxtLink to="/">Home</NuxtLink></li>
          <li><NuxtLink to="/services">Services</NuxtLink></li>
          <li><span aria-current="page">{{ service.title }}</span></li>
        </ol>
      </nav>
      <h1 id="service-title">{{ service.h1 }}</h1>
      <p class="page-hero-copy">{{ service.lead }}</p>
      <div class="hero-actions page-hero-actions">
        <a class="button button-red" :href="business.phoneHref"><AppIcon name="phone" class="icon-fill" /> Call {{ business.phoneDisplay }}</a>
        <NuxtLink class="button button-outline" :to="`/contact?service=${service.slug}`">Send an enquiry <AppIcon name="chevron" /></NuxtLink>
      </div>
    </PageHero>

    <section class="section service-detail">
      <div class="container service-layout">
        <article class="prose">
          <p v-for="(paragraph, i) in service.intro" :key="i" :class="{ 'prose-lead': i === 0 }">{{ paragraph }}</p>

          <h2>What we do</h2>
          <ul class="tick-list">
            <li v-for="item in service.includes" :key="item"><span><AppIcon name="check" /></span>{{ item }}</li>
          </ul>

          <h2>How it works</h2>
          <ol class="steps">
            <li v-for="(step, i) in service.process" :key="step.title">
              <span class="step-number" aria-hidden="true">{{ String(i + 1).padStart(2, '0') }}</span>
              <h3>{{ step.title }}</h3>
              <p>{{ step.text }}</p>
            </li>
          </ol>

          <h2>Common questions</h2>
          <div class="faqs">
            <details v-for="faq in service.faqs" :key="faq.q">
              <summary>{{ faq.q }} <AppIcon name="chevron" /></summary>
              <p>{{ faq.a }}</p>
            </details>
          </div>
        </article>

        <aside class="service-aside" aria-label="Get help">
          <div class="emergency-card">
            <p class="kicker">Need it sorted?</p>
            <h2>Talk to our team</h2>
            <a class="button emergency-call" :href="business.phoneHref"><AppIcon name="phone" class="icon-fill" /> {{ business.phoneDisplay }}</a>
            <NuxtLink class="aside-link" :to="`/contact?service=${service.slug}`">Or send an enquiry <AppIcon name="chevron" /></NuxtLink>
          </div>
          <nav class="other-services" aria-labelledby="other-services-title">
            <h2 id="other-services-title">Other services</h2>
            <ul>
              <li v-for="other in others" :key="other.slug">
                <NuxtLink :to="`/services/${other.slug}`"><AppIcon :name="other.icon" /> {{ other.h1 }} <AppIcon name="chevron" /></NuxtLink>
              </li>
            </ul>
          </nav>
          <div class="service-area">
            <h3>Areas we cover</h3>
            <ul>
              <li v-for="area in business.serviceArea" :key="area">{{ area }}</li>
            </ul>
          </div>
        </aside>
      </div>
    </section>

    <section class="cta" aria-labelledby="cta-title">
      <div class="container cta-inner">
        <div>
          <p class="kicker">Based in Cross Hands, Carmarthenshire</p>
          <h2 id="cta-title">Let's keep your equipment moving.</h2>
          <p>Serving Llanelli, Carmarthen, Ammanford, Swansea and across South Wales.</p>
        </div>
        <div class="cta-actions">
          <a class="button button-red" :href="business.phoneHref"><AppIcon name="phone" class="icon-fill" /> {{ business.phoneDisplay }}</a>
          <NuxtLink class="button button-outline" :to="`/contact?service=${service.slug}`">Send an enquiry <AppIcon name="chevron" /></NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>
