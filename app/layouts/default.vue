<script setup lang="ts">
const { business } = useAppConfig()
const { url: siteUrl } = useSiteConfig()
const { address } = business
const content = useContent()

// <html lang>, canonical, hreflang alternates and og:locale for the current language.
const localeHead = useLocaleHead({ seo: true })
useHead(() => ({
  htmlAttrs: { lang: localeHead.value.htmlAttrs.lang },
  link: [...(localeHead.value.link ?? [])],
  meta: [...(localeHead.value.meta ?? [])],
}))

// Site-wide LocalBusiness data; service pages reference it by @id.
useJsonLd("business", {
  "@type": "LocalBusiness",
  "@id": useBusinessId(),
  name: business.name,
  alternateName: "CHS",
  url: siteUrl,
  logo: new URL("/images/chs-logo.png", siteUrl).href,
  image: new URL("/images/service-van.jpg", siteUrl).href,
  telephone: business.phoneIntl,
  email: business.email,
  description: content.value.home.seo.description,
  ...(address.street && address.postcode
    ? {
        address: {
          "@type": "PostalAddress",
          streetAddress: address.street,
          addressLocality: address.town,
          addressRegion: address.region,
          postalCode: address.postcode,
          addressCountry: "GB",
        },
      }
    : {}),
  areaServed: business.towns.map((name) => ({ "@type": "City", name })),
  openingHours: business.openingHours,
  knowsAbout: content.value.services.map((s) => s.h1),
  knowsLanguage: ["en-GB", "cy-GB"],
  ...(business.sameAs.length ? { sameAs: business.sameAs } : {}),
})
</script>

<template>
  <div id="top">
    <a
      href="#main"
      class="sr-only z-100 bg-white px-3.5 py-2.5 text-black focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >{{ content.common.skipToContent }}</a
    >
    <AppHeader />
    <main id="main">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>
