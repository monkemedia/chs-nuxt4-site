export default defineNuxtConfig({
  compatibilityDate: '2026-09-01',
  devtools: { enabled: false },
  modules: ['@nuxt/image', '@nuxtjs/sitemap'],
  app: {
    head: {
      htmlAttrs: { lang: 'en-GB' },
      meta: [
        { name: 'theme-color', content: '#0b1114' },
        { name: 'color-scheme', content: 'light dark' }
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
    // Content pages need no client-side Vue: skipping the Nuxt bundle keeps them fast.
    // The burger menu is a small inline script (see AppHeader.vue). /contact hydrates for the form.
    '/': { prerender: true, noScripts: true },
    '/services': { prerender: true, noScripts: true },
    '/services/**': { prerender: true, noScripts: true },
    '/contact': { prerender: true }
  },
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/', '/services', '/contact', '/sitemap.xml']
    }
  }
})
