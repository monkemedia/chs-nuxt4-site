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

Build-time environment variables (both optional). Copy `.env.example` to `.env` for local builds (Nuxt loads it for `dev` and `generate`; `.env` is git-ignored). In production, set them in the host's build settings. Values are baked into the static pages and are public, so never put secrets here.

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
    AppHeader.vue         UHeader: desktop nav with gliding orange indicator, slide-over mobile menu
    AppFooter.vue
    PageHero.vue          Dark hero with preloaded image, used by every inner page
    ServiceCard.vue       Card used on the homepage and /services
    CtaBand.vue           "Let's keep your equipment moving" call-to-action strip
    ReviewsSection.vue    Google reviews + testimonials (hidden in production until reviews exist)
    StarRating.vue        1–5 star display (filled `i-chs-star` icon)
    GoogleRatingBadge.vue Hero rating line, shown once the rating meets the threshold
  composables/usePageSeo.ts  usePageSeo, useJsonLd, useBreadcrumbs, useBusinessId
  content/                All copy, per language (see "Languages")
    en/index.ts, cy/index.ts   Page and UI copy (cy typed against en)
    <locale>/services.ts  -> /services and /services/[slug], footer, contact form dropdown
    <locale>/sectors.ts   -> /sectors and the homepage sectors band
    <locale>/benefits.ts  -> /why-chs and the homepage "why" band
  data/reviews.ts         Real Google reviews/testimonials (not translated)
  pages/                  index, about, sectors, why-chs, contact, services/index, services/[slug]
  plugins/analytics.client.ts  Plausible init + tel:/mailto: click events, provides $track
  data/reviews.ts         Real Google reviews/testimonials (empty until they exist); reviews.sample.ts is dev-only
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
- Never hard-code copy in templates: add it to `app/content/en/` and `app/content/cy/`.

### Languages (English / Welsh)

- `@nuxtjs/i18n` with `prefix_except_default`: English at `/`, Welsh at `/cy/`. No browser-language redirects. It outputs `<html lang>`, canonical links, `hreflang` alternates and `og:locale` (via `useLocaleHead` in the layout), plus a sitemap per language (`sitemap_index.xml`).
- **All copy lives in `app/content/<locale>/`**, not i18n JSON messages (they break on `|` and `@`). `cy/index.ts` is typed as `Content`, so `nuxt typecheck` fails if a Welsh string is missing. Services, sectors and benefits must keep the same slugs/order in every locale; `app/content/index.ts` fails the build otherwise.
- In components: `const content = useContent()` then `content.home.heroCopy` in templates. Internal links: `const localePath = useLocalePath()` and `:to="localePath('/about')"`. Pass English paths to `usePageSeo`, `useBreadcrumbs` and `CtaBand`; they localise them.
- The language switcher uses `NuxtLink` + `useSwitchLocalePath()`. **Not `ULink`**, which re-localises the path and sends Welsh visitors back to `/cy/…`.
- Contact enquiries always send the English urgency label plus a `language` field, so the business knows to reply in Welsh.
- The Welsh is a drafted translation: have it checked by a fluent speaker (e.g. the Welsh Government's free Helo Blod service) before launch.

### Styling

- **Tailwind utilities in templates.** No component `<style>` blocks, no new global CSS classes. Shared patterns live in `main.css` as `@utility` (`kicker`, `heading-display`).
- **Theme tokens** in `main.css`:
  - `chs-50…950`: brand orange. `primary` = `chs`, with 500 (`#FD5D01`) as the brand colour for buttons, panels and accents.
  - **Small orange text:** use `text-chs-700` on light backgrounds (5.1–5.6:1) and `text-chs-400` on dark ones (7.3:1). `text-primary` (500) only reaches 3.1:1 on white, so never use it for small text on light backgrounds.
  - **Errors use Nuxt UI's `error` / Tailwind `red`**, never the brand scale.
  - `ink-700…950`: near-blacks. The header, hero and dark bands use `ink-950` (`#0D1012`) / `ink-900`.
  - `font-display`: Lato, for headings via `heading-display`.
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

### Reviews and testimonials

- `<ReviewsSection>` (homepage and `/why-chs`) renders `app/data/reviews.ts`: Google reviews and testimonials in one list, plus the overall `googleRating`. With `business.googlePlaceId` set in `app.config.ts`, it also shows "Read all reviews on Google" and "Leave us a review" links.
- `<GoogleRatingBadge>` shows "★★★★★ 4.8 on Google · 23 reviews" under the homepage hero buttons, but only once `googleRating` meets `ratingBadgeThreshold` in `reviews.ts` (10+ reviews, 4.5+ stars). Shared logic (dev samples, rating, Google links) lives in `composables/useReviews.ts`.
- **Only real reviews**, copied exactly (Google) or collected with permission (testimonials). Never write, edit or pad reviews: it breaches UK consumer law (CMA) and Google policy.
- With `reviews` empty the section renders nothing in production. `npm run dev` shows labelled samples from `reviews.sample.ts` instead. The dev check (`import.meta.dev`) is written out in each expression so production builds drop the samples; keep it that way, and keep the sample badge inside `<DevOnly>`.
- **No `Review` / `AggregateRating` JSON-LD for the business itself.** Google treats reviews a business shows about itself as self-serving and won't give them star rich results.

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
- **Service, sector, benefit and About content was drafted, not supplied by the business.** Claims (e.g. "Established 2004", "while you wait" turnaround, machine lists) must be checked with CHS. Never invent reviews or testimonials; `app/data/reviews.ts` is empty until real ones exist.
- `public/images/` are low-resolution crops from the design mockup; replace them with real photography. `hero-hydraulic.jpg`, `industrial-bg.jpg`, `service-van.jpg` and `chs-logo-source.jpg` are unused originals kept as sources.

## Before finishing a change

1. `npx nuxt typecheck` passes and `npm run format:check` is clean.
2. `npm run generate` succeeds.
3. For UI changes, check desktop (1440), tablet (820) and mobile (390) widths: no horizontal overflow, no console errors.
