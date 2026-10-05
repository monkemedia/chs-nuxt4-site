// Live online booking needs the server functions in server/api/booking, so it's only on when a
// Fergus token (or the mock calendar) is set *and* this is a server build (`nuxt build`), not a
// purely static `nuxt generate`. Otherwise there's no /book page and the booking buttons hide.
const liveBooking =
  !process.argv.includes("generate") &&
  (!!process.env.NUXT_FERGUS_API_TOKEN ||
    process.env.NUXT_FERGUS_MOCK === "true")

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
    // Server only (secrets). Fergus API token for live booking: NUXT_FERGUS_API_TOKEN. Never in
    // a NUXT_PUBLIC_ variable. NUXT_FERGUS_MOCK=true uses a pretend calendar instead (testing).
    fergusApiToken: "",
    fergusMock: false,
    // Job type for booked jobs ("Charge Up", "Quote" or "Estimate") and the Fergus user id
    // bookings are assigned to (empty = unassigned).
    fergusJobType: "Charge Up",
    fergusUserId: "",
    // Booking confirmation emails through Resend: NUXT_RESEND_API_KEY (secret) and the sender,
    // on a domain verified in Resend (NUXT_EMAIL_FROM).
    resendApiKey: "",
    emailFrom: "CHS Hydraulics <bookings@chshydraulics.co.uk>",
    public: {
      liveBooking,
      // Form service URL (e.g. https://formspree.io/f/xxxx), set via NUXT_PUBLIC_CONTACT_FORM_ENDPOINT at build time.
      contactFormEndpoint: "",
      // Site domain as added in Plausible (e.g. www.chshydraulics.co.uk), set via NUXT_PUBLIC_PLAUSIBLE_DOMAIN at build time. Empty = no analytics.
      plausibleDomain: "",
      // Preview build only: include draft jobs and keep every page out of search engines.
      // Set NUXT_PUBLIC_SHOW_DRAFTS=true on the preview deployment, never on the live site.
      showDrafts: false,
      // Year of the build, for {years} of experience (from app.config `foundingYear`). Taken
      // at build time, not from the visitor's clock, so prerendered pages and hydration agree;
      // the first rebuild of the year moves it on.
      buildYear: new Date().getFullYear(),
      // "live", or "coming-soon" / "maintenance" to show the holding page on every URL
      // (set NUXT_PUBLIC_SITE_MODE in the host's build settings and redeploy).
      siteMode: "live",
      // Fergus (job management) links, once set up in Fergus. Empty = not used. Booking URL: the
      // booking buttons link to Fergus's hosted page (when the site's own live booking is off).
      // Portal URL: turns on /login and the "Customer login" links.
      // Set NUXT_PUBLIC_FERGUS_BOOKING_URL / NUXT_PUBLIC_FERGUS_PORTAL_URL at build time.
      fergusBookingUrl: "",
      fergusPortalUrl: "",
    },
  },
  sitemap: {
    // Holding page previews, and the customer login (a gateway to Fergus, not a search result).
    exclude: [
      "/coming-soon",
      "/maintenance",
      "/login",
      ...(liveBooking ? [] : ["/book"]),
    ],
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
    // Holding page previews: prerendered so they can be checked on a deployment, but never
    // indexed (noindex) or listed (sitemap.exclude).
    "/coming-soon": { prerender: true },
    "/maintenance": { prerender: true },
    "/cy/coming-soon": { prerender: true },
    "/cy/maintenance": { prerender: true },
  },
  nitro: {
    // On Vercel the build uses the Build Output API, which ignores vercel.json's rewrites and
    // headers, so the admin area's (studio/, built into /admin) routing lives here. These run
    // before static files: every /admin page path (no file extension) serves the studio's
    // index.html, and nothing under /admin is indexed.
    vercel: {
      config: {
        routes: [
          {
            src: "^/admin(?:/.*)?$",
            headers: { "X-Robots-Tag": "noindex, nofollow" },
            continue: true,
          },
          { src: "^/admin(?:/[^.]*)?$", dest: "/admin/index.html" },
          // Maintenance mode (NUXT_PUBLIC_SITE_MODE=maintenance): every page URL serves the
          // maintenance page with 503 and Retry-After, so search engines treat the outage as
          // temporary instead of dropping pages. Files (scripts, images, icons) and /admin
          // still load. Only on Vercel; the static output alone would give 404s.
          ...(process.env.NUXT_PUBLIC_SITE_MODE === "maintenance"
            ? [
                {
                  src: "^/cy(?:/[^._][^.]*)?/?$",
                  dest: "/cy/maintenance/index.html",
                  status: 503,
                  headers: { "Retry-After": "3600" },
                },
                {
                  src: "^/(?!admin(?:/|$)|api(?:/|$)|cy(?:/|$))(?:[^._][^.]*)?/?$",
                  dest: "/maintenance/index.html",
                  status: 503,
                  headers: { "Retry-After": "3600" },
                },
              ]
            : []),
          // Nitro types routes too narrowly (only cache-control headers); Vercel accepts any.
        ] as never,
      },
    },
    prerender: {
      crawlLinks: true,
      routes: ["/", "/cy", "/services", "/contact", "/sitemap_index.xml"],
      // The customer login only exists once the Fergus portal link is set, and /book only while
      // live booking is on.
      ignore: [
        ...(process.env.NUXT_PUBLIC_FERGUS_PORTAL_URL
          ? []
          : ["/login", "/cy/login"]),
        ...(liveBooking ? [] : ["/book", "/cy/book"]),
      ],
    },
  },
})
