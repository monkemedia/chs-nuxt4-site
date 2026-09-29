import { readdirSync, readFileSync } from "node:fs"
import { parseJob } from "./app/data/jobs-schema"

// Whether any job in app/data/jobs/ is live (import.meta.glob isn't available here).
const hasJobs = readdirSync("app/data/jobs")
  .filter((file) => file.endsWith(".json"))
  .some(
    (file) =>
      "job" in
      parseJob(file, JSON.parse(readFileSync(`app/data/jobs/${file}`, "utf8"))),
  )

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
    },
  },
  // /work 404s until a job is live (app/data/jobs/), so leave it out of the
  // prerender (Nuxt adds every static page) and the sitemap until then.
  sitemap: {
    exclude: hasJobs ? [] : ["/work", "/cy/work"],
  },
  site: {
    url: "https://www.chshydraulics.co.uk",
    name: "CHS Hydraulics",
  },
  image: {
    quality: 78,
    format: ["avif", "webp"],
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
      ignore: hasJobs ? [] : ["/work", "/cy/work"],
    },
  },
})
