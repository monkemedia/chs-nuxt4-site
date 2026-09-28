<script setup lang="ts">
const { business } = useAppConfig()
const { url: siteUrl } = useSiteConfig()
const { address } = business
const content = useContent()
// Placeholder founder names ([bracketed]) stay out of structured data.
const founders = business.founders.filter(
  (founder) => !founder.name.startsWith("["),
)

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
  legalName: business.legalName,
  alternateName: ["CHS", business.formerName],
  url: siteUrl,
  logo: new URL("/images/chs-logo-source.png", siteUrl).href,
  image: new URL("/images/service-van.png", siteUrl).href,
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
  foundingDate: business.foundingYear,
  ...(founders.length
    ? {
        founder: founders.map((founder) => ({
          "@type": "Person",
          name: founder.name,
        })),
      }
    : {}),
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
