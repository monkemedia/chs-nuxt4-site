<script setup lang="ts">
import { services } from '~/data/services'

const { business } = useAppConfig()
const site = useSiteConfig()
const { address } = business

// Site-wide LocalBusiness data; service pages reference it by @id.
useJsonLd('business', {
  '@type': 'LocalBusiness',
  '@id': useBusinessId(),
  name: business.name,
  alternateName: 'CHS',
  url: site.url,
  logo: new URL('/images/chs-logo.png', site.url).href,
  image: new URL('/images/van.jpg', site.url).href,
  telephone: business.phoneIntl,
  email: business.email,
  description: 'Hydraulic hose replacement, ram and cylinder repairs, system fault finding and mobile on-site hydraulic service in Cross Hands, Llanelli and Carmarthenshire.',
  ...(address.street && address.postcode
    ? { address: { '@type': 'PostalAddress', streetAddress: address.street, addressLocality: address.town, addressRegion: address.region, postalCode: address.postcode, addressCountry: 'GB' } }
    : {}),
  areaServed: business.towns.map(name => ({ '@type': 'City', name })),
  openingHours: business.openingHours,
  knowsAbout: services.map(s => s.h1),
  ...(business.sameAs.length ? { sameAs: business.sameAs } : {})
})
</script>

<template>
  <div id="top">
    <a href="#main" class="sr-only z-100 bg-white px-3.5 py-2.5 text-black focus:not-sr-only focus:fixed focus:top-3 focus:left-3">Skip to main content</a>
    <AppHeader />
    <main id="main">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>
