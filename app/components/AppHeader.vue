<script setup lang="ts">
const { business } = useAppConfig()
const route = useRoute()

const links = [
  { label: 'Home', to: '/#top' },
  { label: 'Services', to: '/services' },
  { label: 'About', to: '/#about' },
  { label: 'Sectors', to: '/#sectors' },
  { label: 'Why CHS', to: '/#why' },
  { label: 'Contact', to: '/contact' }
]

// Home sections are anchors on "/", so only the page-level links can be current.
function isCurrent(to: string) {
  if (to === '/#top') return route.path === '/'
  return !to.startsWith('/#') && (route.path === to || route.path.startsWith(`${to}/`))
}

// The burger menu runs as a small inline script rather than Vue state, so it works on
// pages rendered with `noScripts` (no Nuxt bundle) as well as hydrated ones.
// Listeners are delegated from `document` and guarded so they're only ever bound once.
const navScript = `(() => {
  if (window.__chsNav) return
  window.__chsNav = true
  const doc = document
  const isOpen = () => !!doc.querySelector('.site-header.is-open')
  const set = (open, returnFocus) => {
    const header = doc.querySelector('.site-header')
    const toggle = doc.querySelector('.nav-toggle')
    if (!header || !toggle) return
    header.classList.toggle('is-open', open)
    doc.querySelector('.nav-backdrop')?.classList.toggle('is-open', open)
    toggle.setAttribute('aria-expanded', String(open))
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu')
    doc.documentElement.classList.toggle('nav-open', open)
    if (returnFocus) toggle.focus()
  }
  doc.addEventListener('click', (event) => {
    const target = event.target.closest?.('.nav-toggle, .nav-backdrop, #primary-nav a, .brand')
    if (!target) return
    if (target.matches('.nav-toggle')) set(!isOpen())
    else if (isOpen()) set(false)
  })
  doc.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && isOpen()) set(false, true)
  })
  // The menu panel only exists below the desktop breakpoint, so reset it when the viewport grows.
  matchMedia('(min-width: 1024px)').addEventListener('change', (event) => {
    if (event.matches) set(false)
  })
})()`

useHead({ script: [{ key: 'nav', innerHTML: navScript, tagPosition: 'bodyClose' }] })
</script>

<template>
  <header class="site-header">
    <div class="container nav-wrap">
      <NuxtLink class="brand" to="/#top" aria-label="Crosshands Hydraulic Services home">
        <NuxtPicture src="/images/chs-logo-white.png" alt="CHS Crosshands Hydraulic Services" sizes="170px" width="170" height="83" densities="x1 x2" format="avif,webp" />
      </NuxtLink>

      <nav id="primary-nav" class="primary-nav" aria-label="Primary navigation">
        <ul>
          <li v-for="link in links" :key="link.to">
            <NuxtLink :to="link.to" :aria-current="isCurrent(link.to) ? 'page' : undefined">{{ link.label }}</NuxtLink>
          </li>
        </ul>
        <a class="button button-red nav-panel-call" :href="business.phoneHref">
          <AppIcon name="phone" /> Call {{ business.phoneDisplay }}
        </a>
      </nav>

      <a class="header-call" :href="business.phoneHref" aria-label="Call CHS Hydraulic Services">
        <AppIcon name="phone" />
        <span class="header-call-text"><strong>Call now</strong><span>{{ business.phoneDisplay }}</span></span>
      </a>

      <button class="nav-toggle" type="button" aria-controls="primary-nav" aria-expanded="false" aria-label="Open menu">
        <AppIcon name="menu" class="nav-icon-open" />
        <AppIcon name="close" class="nav-icon-close" />
      </button>
    </div>
  </header>
  <div class="nav-backdrop" aria-hidden="true" />
</template>
