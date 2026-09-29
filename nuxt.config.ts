export default defineNuxtConfig({
  compatibilityDate: "2026-09-01",
  devtools: { enabled: false },
  modules: ["@nuxt/ui", "@nuxtjs/i18n", "@nuxt/image", "@nuxtjs/sitemap"],
  css: ["~/assets/css/main.css"],
  ui: {
    // Light-only design with system fonts: skip the color-mode and web-font modules.
    colorMode: false,
    fonts: false,
  },
  icon: {
    // Bundle icons at build time: a static host has no icon API to fetch from.
    serverBundle: { collections: ["lucide", "circle-flags"] },
    clientBundle: { scan: true },
    customCollections: [{ prefix: "chs", dir: "./app/assets/icons" }],
  },
  app: {
    head: {
      meta: [
        { name: "theme-color", content: "#0d1012" },
        { name: "color-scheme", content: "light" },
      ],
      // Icons in public/ are generated from favicon.svg (see AGENTS.md "Favicon").
      link: [
        { rel: "icon", href: "/favicon.ico", sizes: "48x48" },
        { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
        { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
        { rel: "manifest", href: "/site.webmanifest" },
      ],
    },
  },
  i18n: {
    // English at /, Welsh at /cy/. Copy lives in app/content/<locale>/, not i18n JSON.
    baseUrl: "https://www.chshydraulics.co.uk",
    defaultLocale: "en",
    strategy: "prefix_except_default",
    locales: [
      { code: "en", language: "en-GB", name: "English" },
      { code: "cy", language: "cy-GB", name: "Cymraeg" },
    ],
    // No automatic redirects by browser language: bad for SEO and static hosting.
    detectBrowserLanguage: false,
  },
  runtimeConfig: {
    public: {
      // Form service URL (e.g. https://formspree.io/f/xxxx), set via NUXT_PUBLIC_CONTACT_FORM_ENDPOINT at build time.
      contactFormEndpoint: "",
      // Site domain as added in Plausible (e.g. www.chshydraulics.co.uk), set via NUXT_PUBLIC_PLAUSIBLE_DOMAIN at build time. Empty = no analytics.
      plausibleDomain: "",
      // Preview build only: include draft jobs and keep every page out of search engines.
      // Set NUXT_PUBLIC_SHOW_DRAFTS=true on the preview deployment, never on the live site.
      showDrafts: false,
    },
  },
  site: {
    url: "https://www.chshydraulics.co.uk",
    name: "CHS Hydraulics",
  },
  image: {
    quality: 78,
    format: ["avif", "webp"],
    // Job photos uploaded in the admin area are served from Sanity's CDN.
    domains: ["cdn.sanity.io"],
  },
  routeRules: {
    "/": { prerender: true },
    "/services/**": { prerender: true },
    "/contact": { prerender: true },
  },
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ["/", "/cy", "/services", "/contact", "/sitemap_index.xml"],
    },
  },
})
