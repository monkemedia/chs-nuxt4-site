// Site-wide head for every page, including the holding pages (which skip the layout):
// <html lang>, canonical, hreflang alternates and og:locale for the current language, and
// the LocalBusiness structured data that service and area pages reference by @id.
export function useSiteHead() {
  const { business } = useAppConfig()
  const { url: siteUrl } = useSiteConfig()
  const { address } = business
  const content = useContent()
  const { specs: openingHours, closures } = useOpeningHours()
  // Placeholder founder names ([bracketed]) stay out of structured data.
  const founders = business.founders.filter(
    (founder) => !founder.name.startsWith("["),
  )

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
    slogan: business.tagline,
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
            streetAddress: [address.street, address.locality]
              .filter(Boolean)
              .join(", "),
            addressLocality: address.town,
            addressRegion: address.region,
            postalCode: address.postcode,
            addressCountry: "GB",
          },
        }
      : {}),
    geo: {
      "@type": "GeoCoordinates",
      latitude: business.geo.latitude,
      longitude: business.geo.longitude,
    },
    areaServed: business.towns.map((name) => ({ "@type": "City", name })),
    openingHours,
    // Holiday closures, as Google's special opening hours (closed all day).
    ...(closures.value.length
      ? {
          openingHoursSpecification: closures.value.map((c) => ({
            "@type": "OpeningHoursSpecification",
            opens: "00:00",
            closes: "00:00",
            validFrom: c.from,
            validThrough: c.to,
          })),
        }
      : {}),
    knowsAbout: content.value.services.map((s) => s.h1),
    knowsLanguage: ["en-GB", "cy-GB"],
    foundingDate: business.foundingYear,
    hasCredential: {
      "@type": "EducationalOccupationalCredential",
      credentialCategory: "certification",
      name: business.certification.standard,
      recognizedBy: {
        "@type": "Organization",
        name: business.certification.body,
      },
      ...(business.certification.certificateNumber.startsWith("[")
        ? {}
        : { identifier: business.certification.certificateNumber }),
    },
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

  return { content }
}
