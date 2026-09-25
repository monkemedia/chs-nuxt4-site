interface PageSeo {
  title: string
  description: string
  path: string
  image?: string
}

// Title, description, canonical and social tags for a page.
export function usePageSeo({
  title,
  description,
  path,
  image = "/images/hero.jpg",
}: PageSeo) {
  const { url: siteUrl, name: siteName } = useSiteConfig()
  const url = new URL(path, siteUrl).href

  useSeoMeta({
    title,
    description,
    ogTitle: title,
    ogDescription: description,
    ogType: "website",
    ogUrl: url,
    ogImage: new URL(image, siteUrl).href,
    ogSiteName: siteName,
    ogLocale: "en_GB",
    twitterCard: "summary_large_image",
    robots: "index, follow",
  })
  useHead({ link: [{ rel: "canonical", href: url }] })
}

// Adds one JSON-LD block; `key` stops duplicates when a page re-renders.
export function useJsonLd(key: string, data: Record<string, unknown>) {
  useHead({
    script: [
      {
        key,
        type: "application/ld+json",
        innerHTML: JSON.stringify({
          "@context": "https://schema.org",
          ...data,
        }),
      },
    ],
  })
}

export function useBusinessId() {
  const { url } = useSiteConfig()
  return new URL("/#business", url).href
}

export function useBreadcrumbs(items: { name: string; path: string }[]) {
  const { url: siteUrl } = useSiteConfig()
  useJsonLd("breadcrumbs", {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: new URL(item.path, siteUrl).href,
    })),
  })
}
