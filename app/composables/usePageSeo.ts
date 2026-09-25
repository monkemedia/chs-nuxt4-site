interface PageSeo {
  title: string
  description: string
  path: string
  image?: string
}

// Title, description and social tags for a page. `path` is the English path; it's
// localised here. Canonical, hreflang alternates and og:locale come from @nuxtjs/i18n
// (useLocaleHead in layouts/default.vue).
export function usePageSeo({
  title,
  description,
  path,
  image = "/images/hero.jpg",
}: PageSeo) {
  const { url: siteUrl, name: siteName } = useSiteConfig()
  const localePath = useLocalePath()
  const url = new URL(localePath(path), siteUrl).href

  useSeoMeta({
    title,
    description,
    ogTitle: title,
    ogDescription: description,
    ogType: "website",
    ogUrl: url,
    ogImage: new URL(image, siteUrl).href,
    ogSiteName: siteName,
    twitterCard: "summary_large_image",
    robots: "index, follow",
  })
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

// `path`s are English paths; they're localised here.
export function useBreadcrumbs(items: { name: string; path: string }[]) {
  const { url: siteUrl } = useSiteConfig()
  const localePath = useLocalePath()
  useJsonLd("breadcrumbs", {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: new URL(localePath(item.path), siteUrl).href,
    })),
  })
}
