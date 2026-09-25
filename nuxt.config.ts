export default defineNuxtConfig({
  compatibilityDate: '2026-09-01',
  devtools: { enabled: false },
  modules: ['@nuxt/ui', '@nuxt/image', '@nuxtjs/sitemap'],
  css: ['~/assets/css/main.css'],
  ui: {
    // Light-only design with system fonts: skip the color-mode and web-font modules.
    colorMode: false,
    fonts: false
  },
  icon: {
    // Bundle icons at build time: a static host has no icon API to fetch from.
    serverBundle: { collections: ['lucide'] },
    clientBundle: { scan: true },
    customCollections: [{ prefix: 'chs', dir: './app/assets/icons' }]
  },
  app: {
    head: {
      htmlAttrs: { lang: 'en-GB' },
      meta: [
        { name: 'theme-color', content: '#0d1012' },
        { name: 'color-scheme', content: 'light' }
      ],
      link: [{ rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' }]
    }
  },
  runtimeConfig: {
    public: {
      // Form service URL (e.g. https://formspree.io/f/xxxx), set via NUXT_PUBLIC_CONTACT_FORM_ENDPOINT at build time.
      contactFormEndpoint: ''
    }
  },
  site: {
    url: 'https://www.chshydraulics.co.uk',
    name: 'CHS Hydraulic Services'
  },
  image: {
    quality: 78,
    format: ['avif', 'webp']
  },
  routeRules: {
    '/': { prerender: true },
    '/services/**': { prerender: true },
    '/contact': { prerender: true }
  },
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/', '/services', '/contact', '/sitemap.xml']
    }
  }
})
