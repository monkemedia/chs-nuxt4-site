# AGENTS.md

Guide for AI coding agents (and developers) working on this repo: how the site is built, the conventions to follow, and the gotchas already hit.

## What this is

Static marketing site for **Crosshands Hydraulic Services (CHS)**, a hydraulic repair business in Cross Hands, Llanelli, Carmarthenshire. The goals are local SEO (rank for hydraulic repairs in Llanelli / Carmarthenshire / South Wales) and turning visitors into phone calls and enquiries.

## Stack

- **Nuxt 4**, fully prerendered with `nuxt generate` (static output in `.output/public/`, no server at runtime).
- **Nuxt UI 4** components and **Tailwind CSS v4**. No other UI or CSS framework.
- **@nuxt/image** for AVIF/WebP images, **@nuxtjs/sitemap** for `sitemap.xml`.
- **zod** for form validation, **Plausible** (`@plausible-analytics/tracker`) for analytics.
- TypeScript 5.9 with `vue-tsc` (TypeScript 7 breaks `vue-tsc`; don't upgrade it).
- `vue-router` 5 is a direct dependency to match Nuxt. Don't add a v4 copy.

## Commands

```bash
npm install          # postinstall runs `nuxt prepare` (generates .nuxt types)
npm run dev          # dev server (slow, unbundled; never use it for Lighthouse)
npm run generate     # production static build -> .output/public
npm run preview      # serve the static build
npx nuxt typecheck   # type check; must pass with no errors
npm run format       # Prettier (no semicolons); format:check to verify
```

Build-time environment variables (both optional):

| Variable                            | Purpose                                                          | Unset                                       |
| ----------------------------------- | ---------------------------------------------------------------- | ------------------------------------------- |
| `NUXT_PUBLIC_CONTACT_FORM_ENDPOINT` | Form service URL (Formspree-style, FormData POST, 2xx = success) | Form shows an error asking visitors to call |
| `NUXT_PUBLIC_PLAUSIBLE_DOMAIN`      | Site domain as added in Plausible                                | No analytics                                |

## Project structure

```
app/
  app.vue                 <UApp> wrapper
  app.config.ts           Nuxt UI theme (colour aliases, component defaults) + `business` details
  assets/css/main.css     Tailwind + Nuxt UI imports, theme tokens, custom utilities
  assets/icons/           Custom SVG icons, used as `i-chs-<name>`
  layouts/default.vue     Skip link, header, footer, site-wide LocalBusiness JSON-LD
  components/
    AppHeader.vue         UHeader: desktop nav with gliding red indicator, slide-over mobile menu
    AppFooter.vue
    PageHero.vue          Dark hero with preloaded image, used by every inner page
    ServiceCard.vue       Card used on the homepage and /services
    CtaBand.vue           "Let's keep your equipment moving" call-to-action strip
  composables/usePageSeo.ts  usePageSeo, useJsonLd, useBreadcrumbs, useBusinessId
  data/                   Content, shared by pages and homepage sections
    services.ts           -> /services and /services/[slug], footer, contact form dropdown
    sectors.ts            -> /sectors and the homepage sectors band
    benefits.ts           -> /why-chs and the homepage "why" band
  pages/                  index, about, sectors, why-chs, contact, services/index, services/[slug]
  plugins/analytics.client.ts  Plausible init + tel:/mailto: click events, provides $track
  utils/ui.ts             Shared `ui` prop overrides (e.g. heroBreadcrumbUi)
public/
  images/                 Site images (small, cropped from the design mockup; replace with real photos)
  _headers                Cache headers for Netlify / Cloudflare Pages
```

## Conventions

### Code style

- **Assign composables to a const first; never chain off the call.** Destructure when you only need part of it.

  ```ts
  // Good
  const { business } = useAppConfig()
  const { url: siteUrl } = useSiteConfig()
  const { $track } = useNuxtApp()
  const runtimeConfig = useRuntimeConfig()
  const endpoint = runtimeConfig.public.contactFormEndpoint as string

  // Bad
  const endpoint = useRuntimeConfig().public.contactFormEndpoint
  useNuxtApp().$track("Enquiry Sent")
  ```

  Call composables at the top of `<script setup>` (or the top of a composable), never inside event handlers or after an `await`.

- **Formatting:** Prettier, configured in `.prettierrc`: **no semicolons**, double quotes, trailing commas. The whole repo is formatted; run `npm run format` after changes (`npm run format:check` to verify). The maintainer's editor also formats on save.
- Match the surrounding comment density. Comments explain _why_, not what.
- Put content in `app/data/*.ts` rather than hard-coding it in templates when it appears in more than one place.

### Styling

- **Tailwind utilities in templates.** No component `<style>` blocks, no new global CSS classes. Shared patterns live in `main.css` as `@utility` (`kicker`, `heading-display`).
- **Theme tokens** in `main.css`:
  - `chs-50…950`: brand red. `primary` = `chs`, with 500 as the brand red for buttons and panels.
  - **Small red text:** use `text-chs-600` on light backgrounds and `text-chs-400` on dark ones. Both pass WCAG AA; `text-primary` (500) does not at small sizes.
  - `ink-700…950`: near-blacks. The header, hero and dark bands use `ink-950` (`#0D1012`) / `ink-900`.
  - `font-display`: Arial Black, for headings via `heading-display`.
- **`--ui-radius` is `0rem`** so Nuxt UI components are square like the design. Nuxt UI defines Tailwind's `rounded-sm…3xl` as multiples of `--ui-radius`, so **those classes do nothing**. Use `rounded-full`, `rounded-none` or arbitrary values like `rounded-[0.5rem]`.
- Colour mode and web fonts are disabled (`ui.colorMode: false`, `ui.fonts: false`): light-only design, system fonts.
- Override Nuxt UI components with the `ui` prop or `class` (merged with tailwind-merge), or globally in `app.config.ts`.

### Nuxt UI usage

- Icons: `UIcon` / `icon` props with Lucide names (`i-lucide-phone`). Icons are bundled at build time (`icon.serverBundle` / `clientBundle.scan`) because a static host has no icon API. Use **full literal icon names** in source so the scanner finds them.
- `ULink` highlights links that match the current route. Use `raw` for links outside the header nav so they don't turn red.
- Outline `UButton` has a white background by default; add `bg-transparent` on dark or grey backgrounds.
- `UHeader` handles the mobile slide-over menu and closes it on navigation.

### Images

- Use `NuxtPicture` with `format="avif,webp"`, explicit `width`/`height`, and a **fixed pixel `sizes` equal to the native width** (e.g. `sizes="524px" densities="x1"`). The source images are small, so larger sizes would only upscale.
- Unprefixed `sizes="100vw ..."` generates junk `1w`/`2w` srcset entries; avoid it.
- Hero/LCP images: a real `<img>` (not a CSS background) with `:preload="{ fetchPriority: 'high' }"` and `fetchpriority: 'high'` in `img-attrs`.

### SEO

- Every page calls `usePageSeo({ title, description, path })`. Keep titles ≤ 60 characters and descriptions ≤ 160, and include a location (Llanelli / Carmarthenshire).
- Inner pages add `useBreadcrumbs([...])` and show a matching `UBreadcrumb` in `PageHero` using `heroBreadcrumbUi`.
- `layouts/default.vue` outputs `LocalBusiness` JSON-LD from `app.config.ts`; service pages add `Service` JSON-LD referencing it via `useBusinessId()`.
- One `h1` per page. The homepage H1 includes the keyword line inside it.
- New pages are picked up by the prerender crawler and sitemap automatically if something links to them.

### Analytics

`app/plugins/analytics.client.ts` provides `$track(event, props)`, which does nothing when Plausible is disabled. Current events: `Phone Call`, `Email Click` (automatic on `tel:` / `mailto:` clicks) and `Enquiry Sent` (contact form success). Each needs a matching goal in Plausible.

## Gotchas already hit

- **`Cannot find native binding`** on build/dev: npm bug with optional dependencies (npm/cli#4828), even on npm 11.6. It can happen after any `npm install <pkg>`. Fix: `rm -rf node_modules package-lock.json && npm install`. Don't add platform-specific binding packages to `package.json`.
- **Query params on prerendered pages:** `/contact` is prerendered without a query, so on a direct load `?service=` is empty while hydrating. Read it from `useRouter().currentRoute` in `onMounted` and `watch` it (see `contact.vue`).
- **Hash links and the sticky header:** `[id]` elements get `scroll-margin-top: var(--ui-header-height)`. Pages with extra sticky bars (e.g. `/sectors`) add more.
- **Plausible ignores `localhost` and automated browsers** (`navigator.webdriver`). To test events: map the real domain to localhost (Chromium `--host-resolver-rules`) and set `window.__plausible = true`.
- **Lighthouse:** measure the `npm run generate` output with a server that compresses responses (e.g. `npx serve`), never `npm run dev`. The current baseline is about 92 performance and 100 accessibility, best practices and SEO on mobile. The ~140 KB of JS for Nuxt UI hydration is the main cost.

## Content and launch caveats

- **Placeholder business details** (phone `01269 123 456`, email, hours, service area, domain `chshydraulics.co.uk`) live in `app/app.config.ts` and `nuxt.config.ts`. They must match the Google Business Profile exactly before launch. Public listings show a different phone number and two conflicting addresses; confirm with the business.
- The street address is only output in JSON-LD once `address.street` and `address.postcode` are set.
- **Service, sector, benefit and About content was drafted, not supplied by the business.** Claims (e.g. "Established 2004", "while you wait", "On-site nationwide", machine lists) must be checked with CHS. Never invent reviews or testimonials.
- `public/images/` are low-resolution crops from the design mockup; replace them with real photography. `hero-hydraulic.jpg`, `industrial-bg.jpg`, `service-van.jpg` and `chs-logo-source.jpg` are unused originals kept as sources.

## Before finishing a change

1. `npx nuxt typecheck` passes and `npm run format:check` is clean.
2. `npm run generate` succeeds.
3. For UI changes, check desktop (1440), tablet (820) and mobile (390) widths: no horizontal overflow, no console errors.
