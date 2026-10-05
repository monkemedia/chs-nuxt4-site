# AGENTS.md

Guide for AI coding agents (and developers) working on this repo: how the site is built, the conventions to follow, and the gotchas already hit.

## What this is

Static marketing site for **CHS Hydraulics**, a hydraulic repair business in Cross Hands, Llanelli, Carmarthenshire. The goals are local SEO (rank for hydraulic repairs in Llanelli / Carmarthenshire / South Wales) and turning visitors into phone calls and enquiries.

## Stack

- **Nuxt 4**, fully prerendered with `nuxt generate` (static output in `.output/public/`, no server at runtime).
- **Nuxt UI 4** components and **Tailwind CSS v4**. No other UI or CSS framework.
- **@nuxt/image** for AVIF/WebP images, **@nuxtjs/sitemap** for `sitemap.xml`.
- **dayjs** for dates and times (`app/utils/date.ts`: auto-imported `dayjs` with UK time zone and English/Welsh locales; never use `Date`/`Intl` formatting directly).
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

| Variable                            | Purpose                                                                         | Unset                                           |
| ----------------------------------- | ------------------------------------------------------------------------------- | ----------------------------------------------- |
| `NUXT_PUBLIC_CONTACT_FORM_ENDPOINT` | Form service URL (Formspree-style, FormData POST, 2xx = success)                | Form shows an error asking visitors to call     |
| `NUXT_PUBLIC_PLAUSIBLE_DOMAIN`      | Site domain as added in Plausible                                               | No analytics                                    |
| `NUXT_PUBLIC_SHOW_DRAFTS`           | `true` on the drafts preview deployment only (see Admin area)                   | Drafts left out (live site)                     |
| `NUXT_PUBLIC_SITE_MODE`             | `coming-soon` or `maintenance`: holding page on every URL                       | Normal site (`live`)                            |
| `NUXT_PUBLIC_FERGUS_BOOKING_URL`    | Fergus hosted booking page: booking buttons link to it (if live booking is off) | No booking buttons (unless live booking is on)  |
| `NUXT_PUBLIC_FERGUS_PORTAL_URL`     | Fergus customer portal: turns on `/login` and its links                         | No `/login` page or links                       |
| `NUXT_FERGUS_API_TOKEN`             | **Secret.** Fergus API token: live booking slots on `/book`                     | No `/book` page; booking buttons hidden         |
| `NUXT_FERGUS_MOCK`                  | `true`: live booking against a pretend calendar (testing)                       | Real Fergus (when a token is set)               |
| `NUXT_RESEND_API_KEY`               | **Secret.** Resend: booking confirmation emails                                 | No customer email (summary via form service)    |
| `NUXT_EMAIL_FROM`                   | Sender for booking emails (domain verified in Resend)                           | `CHS Hydraulics <bookings@chshydraulics.co.uk>` |
| `SANITY_STUDIO_PROJECT_ID`          | Sanity project for the admin area (jobs, reviews)                               | Builds with no jobs or reviews (warns)          |
| `SANITY_STUDIO_DATASET`             | Sanity dataset                                                                  | `production`                                    |
| `SANITY_READ_TOKEN`                 | **Secret.** Preview deployment only: reads drafts from Sanity                   | Preview shows published content only            |

## Project structure

```
app/
  app.vue                 <UApp> wrapper
  error.vue               404/500 page (pressure gauge <ErrorGauge>, copy in `errorPage`); `nuxt generate` writes it to 404.html
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
    ReviewsSection.vue    Google reviews + testimonials (hidden in production until reviews exist)
    StarRating.vue        1–5 star display (filled `i-chs-star` icon)
    GoogleRatingBadge.vue Hero rating line, shown once the rating meets the threshold
  composables/usePageSeo.ts  usePageSeo, useJsonLd, useBreadcrumbs, useBusinessId
  content/                All copy, per language (see "Languages")
    en/index.ts, cy/index.ts   Page and UI copy (cy typed against en)
    <locale>/services.ts  -> /services and /services/[slug], footer, contact form dropdown
    <locale>/sectors.ts   -> /sectors and the homepage sectors band
    <locale>/benefits.ts  -> /why-chs and the homepage "why" band
  data/jobs.ts, reviews.ts  Recent work and reviews, fetched from Sanity at build time (modules/)
  pages/                  index, about, sectors, why-chs, contact, services/index, services/[slug]
  plugins/analytics.client.ts  Plausible init + tel:/mailto: click events, provides $track
  utils/ui.ts             Shared `ui` prop overrides (e.g. heroBreadcrumbUi)
public/
  images/                 Site images (small, cropped from the design mockup; replace with real photos)
  _headers                Cache headers for Netlify / Cloudflare Pages (Vercel: vercel.json)
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

- **Browser events and observers: use VueUse** (`@vueuse/core`, imported explicitly), not raw `addEventListener` / `ResizeObserver` / `matchMedia`: `useEventListener`, `useResizeObserver`, `usePreferredReducedMotion` and so on clean up automatically and are safe during prerendering. VueUse has no scroll-to-element helper, so use the native `el.scrollIntoView()`, with `behavior` from `usePreferredReducedMotion()`.
- **Formatting:** Prettier, configured in `.prettierrc`: **no semicolons**, double quotes, trailing commas. The whole repo is formatted; run `npm run format` after changes (`npm run format:check` to verify). The maintainer's editor also formats on save.
- Match the surrounding comment density. Comments explain _why_, not what.
- Never hard-code copy in templates: add it to `app/content/en/` and `app/content/cy/`.

### Languages (English / Welsh)

- `@nuxtjs/i18n` with `prefix_except_default`: English at `/`, Welsh at `/cy/`. No browser-language redirects. It outputs `<html lang>`, canonical links, `hreflang` alternates and `og:locale` (via `useLocaleHead` in the layout), plus a sitemap per language (`sitemap_index.xml`).
- **All copy lives in `app/content/<locale>/`**, not i18n JSON messages (they break on `|` and `@`). `cy/index.ts` is typed as `Content`, so `nuxt typecheck` fails if a Welsh string is missing. Services, sectors and benefits must keep the same slugs/order in every locale; `app/content/index.ts` fails the build otherwise.
- In components: `const content = useContent()` then `content.home.heroCopy` in templates. Internal links: `const localePath = useLocalePath()` and `:to="localePath('/about')"`. Pass English paths to `usePageSeo`, `useBreadcrumbs` and `CtaBand`; they localise them.
- In the desktop header the language switch is compact (flag + `CY`/`EN`, full name as its `aria-label` and tooltip); the mobile menu spells it out.
- The language switcher uses `NuxtLink` + `useSwitchLocalePath()`. **Not `ULink`**, which re-localises the path and sends Welsh visitors back to `/cy/…`.
- Contact enquiries always send the English urgency label plus a `language` field, so the business knows to reply in Welsh.
- The Welsh is a drafted translation: have it checked by a fluent speaker (e.g. the Welsh Government's free Helo Blod service) before launch.
- **Translators work in Excel, not the code.** `npm run translations:export` writes `translations/chs-welsh-<date>.xlsx`: one row per string, with a friendly "where on the website" label, character limits for Google titles/descriptions, placeholder warnings, and a status (not checked / new / English changed / checked). Only the Welsh and Comments columns are editable. `npm run translations:import <file>` writes the Welsh back into `app/content/cy/` in place (`scripts/translations.ts`, via the TypeScript AST), refuses rows whose `{placeholders}` don't match or whose English changed since export, prints translator comments, and records what was checked in `translations/checked.json` (commit it). Functions that just fill a sentence (e.g. `call: (phone) => \`Call ${phone}\``) are editable like any string and written back as template literals; ones with logic (the pay range) are shown greyed out and changed by hand. Sanity content (jobs, vacancies) isn't included; staff handle that Welsh in the admin area.

### Feature flags (on-site work)

- `app.config.ts` → `features.onsite` is **off until CHS launches on-site/mobile work**. Off: the homepage "We come to you" band, the On-site Service (card, page, footer link, contact dropdown, sector links, sitemap) and the Uptime Promise disappear, and `app/content/<locale>/workshop.ts` replaces every sentence that mentions on-site, mobile or call-out work. Turning it on restores everything; nothing needs deleting.
- **Online booking:** the "On-site visit" service (`onsite` in `shared/utils/booking.ts`) only appears in `<BookingPicker>` while `features.onsite` is on, and the booking API refuses it otherwise (`refuseUnavailable()`), so it can't be booked by calling the API directly. It asks where the machine is.
- `useContent()` applies this, so components need no checks beyond whole sections (`features.onsite` in `index.vue` and `UptimePromise`).
- **When writing copy that mentions on-site work, add a workshop-only version to `workshop.ts` in both languages.** Arrays are patched by index (`{ 1: "…" }` replaces, `{ 2: null }` removes; see `app/content/overrides.ts`). To check nothing leaks, build with the flag off and search the HTML for "on-site", "mobile", "call-out", "ar y safle" and "symudol".

### The offer (years, response time, Uptime Promise)

- `app.config.ts` → `offer` holds the numbers the sales copy relies on: `responseHours` and `uptimePromise`. Copy uses `{years}` / `{hours}` tokens, which `useContent()` fills in, so never type the numbers into copy. `{years}` of experience is worked out from `business.foundingYear` and the build year (`runtimeConfig.public.buildYear`, not the visitor's clock, so hydration matches), so it goes up by itself at the first rebuild of each year.
- `<UptimePromise>` ("on-site within {hours} hours or the call-out's free") renders only when `offer.uptimePromise` is true. It's off until CHS can reliably deliver it; a guarantee they can't keep breaches consumer law.
- **Opening hours** are set by staff in the admin area (**Opening hours**: a normal week plus **holiday closures**). `modules/hours.ts` validates them at build time (`app/data/hours-schema.ts`) and serves them as `virtual:chs-hours`; until they're published, or if they're invalid (build warning), `business.openingHours` in `app.config.ts` is used. Always read them through `useOpeningHours()`. They drive the contact page list (day names and "8am – 5.30pm" formatted per language; content only has the am/pm words, extra notes and closure wording), the open/closed line and the LocalBusiness `openingHours` / `openingHoursSpecification` (closures). Closures that have ended drop off at the next rebuild.
- `<OpenStatus>` shows a live open/closed line (UK time, skipping holiday closures: "Closed for Christmas, open Friday 2 January at 08:00") in the hero and CTA band. It renders client-side only because pages are prerendered.

### Styling

- **Tailwind utilities in templates.** No component `<style>` blocks, no new global CSS classes. Shared patterns live in `main.css` as `@utility` (`kicker`, `heading-display`).
- **Theme tokens** in `main.css`:
  - `chs-50…950`: brand red. `primary` = `chs`, with 500 (`#E5101F`) as the brand colour for buttons, panels and accents. **Never hard-code a brand hex value**; always use the tokens.
  - **Small red text:** use `text-chs-700` on light backgrounds (7.2:1) and `text-chs-400` on dark ones (5.6:1). `text-primary` (500) passes on white (4.8:1) but not on grey panels, so prefer 700 for small text on light backgrounds. White text on `bg-primary` is fine (4.8:1).
  - **Errors use Nuxt UI's `error` / Tailwind `red`**, never the brand scale. The brand is red too, so always pair error colour with an icon or message text rather than relying on colour alone.
  - `ink-700…950`: near-blacks. The header, hero and dark bands use `ink-950` (`#0D1012`) / `ink-900`.
  - `font-display`: Lato, for headings via `heading-display`.
- **Corners:** boxes and cards (anything with a background panel, card shadow or top border: service cards, review cards, info panels, sidebar boxes, icon badges, framed photos) use **`rounded-box`** (6px, `--radius-box` in `main.css`). Full-width bands stay square. Add `overflow-hidden` when a card has an image edge to edge.
- **`--ui-radius` is `0.1rem`**, so Nuxt UI buttons and inputs are almost square like the design. Nuxt UI defines Tailwind's `rounded-sm…3xl` as multiples of `--ui-radius`, so **those classes are tiny (≈1.6–2.4px)**. Use `rounded-box`, `rounded-full`, `rounded-none` or arbitrary values like `rounded-[0.5rem]`.
- Colour mode and web fonts are disabled (`ui.colorMode: false`, `ui.fonts: false`): light-only design, system fonts.
- Override Nuxt UI components with the `ui` prop or `class` (merged with tailwind-merge), or globally in `app.config.ts`.

### Nuxt UI usage

- Icons: `UIcon` / `icon` props with Lucide names (`i-lucide-phone`). Icons are bundled at build time (`icon.serverBundle` / `clientBundle.scan`) because a static host has no icon API. Use **full literal icon names** in source so the scanner finds them.
- `ULink` highlights links that match the current route. Use `raw` for links outside the header nav so they don't turn red.
- Outline `UButton` has a white background by default; add `bg-transparent` on dark or grey backgrounds.
- `UHeader` handles the mobile slide-over menu and closes it on navigation.
- **Header actions:** the red call button stays the main action (calls are the site's goal; breakdowns shouldn't book). The desktop header has no booking button (it made the header too busy); while booking is available, a full-width "Book online" sits under "Call" in the mobile menu, and the pages carry their own booking buttons.
- The header hides while scrolling down and returns on scroll up (`AppHeader.vue`), and on desktop turns compact (64px, smaller logo, one-line call button) once 160px down the page via `<html data-header-compact>`, which shortens `--ui-header-height`. Resizing shifts the page and the browser corrects the scroll position, so scroll direction is ignored for 400ms after a resize; it always shows near the top, with the menu open, on keyboard focus and after navigating. **Sticky elements below it use `top-(--header-offset)`, not `--ui-header-height`**: the offset drops to 0 while the header is hidden (`<html data-header-hidden>`), so they move up with it. `scroll-margin` still uses the full header height.

### Images

- Use `NuxtPicture` with `format="avif,webp"`, explicit `width`/`height`, and a **fixed pixel `sizes` equal to the native width** (e.g. `sizes="524px" densities="x1"`). The source images are small, so larger sizes would only upscale.
- Unprefixed `sizes="100vw ..."` generates junk `1w`/`2w` srcset entries; avoid it.
- Hero/LCP images: a real `<img>` (not a CSS background) with `:preload="{ fetchPriority: 'high' }"` and `fetchpriority: 'high'` in `img-attrs`.

### Logo

- The header and footer use `public/images/chs-logo-mark-white.png`: the "CHS" box only, cut at full resolution from `chs-logo-white.png` (the full lockup with "HYDRAULICS" underneath, which stays for vans, print and the LocalBusiness `logo`). On the site "hydraulics" is already all around it, and at header size the word was unreadable. Keep `alt="CHS Hydraulics"`. If the logo is redrawn, re-cut both from the designer's vector rather than resizing the PNGs.

### Favicon

- `public/favicon.svg` is the source (dark rounded square, two red stripes). `favicon.ico` (16/32/48), `apple-touch-icon.png` (180) and `icon-192/512.png` (for `site.webmanifest`) are generated from it with sharp; regenerate them all if the SVG changes. The head links are in `nuxt.config.ts`.

### SEO

- Every page calls `usePageSeo({ title, description, path })`. Keep titles ≤ 60 characters and descriptions ≤ 160, and include a location (Llanelli / Carmarthenshire).
- Inner pages add `useBreadcrumbs([...])` and show a matching `UBreadcrumb` in `PageHero` using `heroBreadcrumbUi`.
- `useSiteHead()` (from `layouts/default.vue`) outputs `LocalBusiness` JSON-LD from `app.config.ts`; service pages add `Service` JSON-LD referencing it via `useBusinessId()`.
- One `h1` per page. The homepage H1 is the brand line (`business.tagline`, "Driven By Pressure", in `app.config.ts`) with the keyword line inside it. The tagline is also in the footer and the LocalBusiness `slogan`; use `business.tagline` rather than typing it.
- New pages are picked up by the prerender crawler and sitemap automatically if something links to them.

### Reviews and testimonials

- Staff add reviews and the overall Google rating in the **admin area** (see below). `modules/reviews.ts` fetches and validates them at build time (`app/data/reviews-schema.ts`, zod, kept out of the browser bundle) and serves them as `virtual:chs-reviews`; invalid entries are skipped with a `[reviews] Skipped …` warning.
- `<ReviewsSection>` (homepage and `/why-chs`) renders them via `app/data/reviews.ts`: Google reviews and testimonials in one list, newest first, plus the overall `googleRating`. With `business.googlePlaceId` set in `app.config.ts`, it also shows "Read all reviews on Google" and "Leave us a review" links.
- `<GoogleRatingBadge>` shows "★★★★★ 4.8 on Google · 23 reviews" under the homepage hero buttons, but only once `googleRating` meets `ratingBadgeThreshold` in `reviews.ts` (10+ reviews, 4.5+ stars). Shared logic (rating, Google links) lives in `composables/useReviews.ts`.
- **Only real reviews**, copied exactly (Google) or collected with permission (testimonials). Never write, edit or pad reviews: it breaches UK consumer law (CMA) and Google policy.
- With no reviews the section and badge render nothing, in dev and production alike. To preview the design, add a review in the admin area.
- **No `Review` / `AggregateRating` JSON-LD for the business itself.** Google treats reviews a business shows about itself as self-serving and won't give them star rich results.

### Recent work (case studies)

- Staff add and edit jobs in the **admin area** (see below). The "Web address" (Sanity slug, generated from the English title) is the URL; changing it breaks old links.
- `modules/jobs.ts` fetches them at build time (validated by `app/data/jobs-schema.ts` with zod) and serves them as `virtual:chs-jobs`. A job is live once it's published in the admin area; unpublished changes are drafts. The Welsh (`cy`) is optional: without a complete Welsh version the Welsh site shows the English, marked `lang="en"`, with an "only available in English" note (the one exception to "every string in both languages", because staff can't write Welsh). Invalid entries are skipped with a `[jobs] Skipped …` build warning, so a half-finished entry never breaks a deploy. Keep `studio/schemas/job.ts` in step with the zod schema (the studio's service list is read from `app/content/en/services.ts`).
- **Drafts** are fetched only in `npm run dev` and in a preview build with `NUXT_PUBLIC_SHOW_DRAFTS=true` plus `SANITY_READ_TOKEN`, so the live site's HTML and JS never contain them. Staff check drafts on a second deployment of the same repo with that variable set: drafts get a "Draft" badge and banner, and every page is `noindex`. Never set it on the live site.
- The page title and meta description come from the job's title and summary. `useJobs()` returns live jobs in the current language, newest first, and fails the build on a duplicate slug or unknown service.
- Shown at `/work` and `/work/<slug>` (`Article` JSON-LD), in `<RecentJobs>` on the homepage, the matching service page and under other jobs, and as a footer link.
- With no job to show, the build shows nothing and `/work` is kept out of the prerender and sitemap (`modules/jobs.ts`).
- **Only real jobs**, with CHS's own photos. Name a customer only with their permission. Add a header nav link once there are a few jobs.

### Careers (vacancies)

- Staff add vacancies in the **admin area** (Vacancies). `modules/vacancies.ts` fetches them at build time (validated by `app/data/vacancies-schema.ts`) and serves them as `virtual:chs-vacancies`; keep `studio/schemas/vacancy.ts` in step. Welsh is optional, as with jobs.
- Shown at `/careers` and `/careers/<slug>` (`JobPosting` JSON-LD for Google for Jobs), with a footer link and a header nav link flagged "Hiring" (desktop from `xl` only: seven links overflow the Welsh nav below that). Applications go by email (`business.email`, subject "Application: <title>") or phone.
- With no live vacancy, `/careers` is kept out of the prerender, sitemap and footer. Vacancies past their `closes` date are dropped, but only at the next rebuild, so staff should unpublish a filled role.
- **Examples:** while the admin area has no vacancies, dev and the preview build (`NUXT_PUBLIC_SHOW_DRAFTS=true`) show the examples in `app/data/vacancies-examples.ts`, marked as drafts. They never reach the live site.
- The "Why join us" points (`careersPage.why`) were drafted: check them with CHS.

### Admin area (Sanity)

- Staff manage **Recent work**, **Reviews**, **Vacancies**, **Opening hours** and the **Google rating** at `/admin`: Sanity Studio, in `studio/` (own `package.json`; schemas in `studio/schemas/`). Staff log in with the email or Google account they were invited with (sanity.io/manage → project → Members). Content lives in Sanity, not the repo, so staff edits never touch git.
- The site stays fully static. `modules/lib/sanity.ts` fetches everything in one GROQ query at build time (published content from the API CDN; drafts, for the preview build, with `SANITY_READ_TOKEN`). Photos are served from `cdn.sanity.io` and resized by `@nuxt/image` at build time. A Sanity API error fails the build rather than publishing a site with the content missing.
- **Publishing rebuilds the site:** a Sanity webhook (sanity.io/manage → API → Webhooks, on create/update/delete of `job`, `review`, `googleRating`, `vacancy`, `openingHours`) calls the Vercel deploy hook. The preview deployment gets its own webhook with drafts included.
- **Building:** `npm run generate` builds the site, then `npm run build:admin` builds the studio into its `/admin` (Vercel's `buildCommand` runs both). On Vercel the site builds to `.vercel/output/static` (Build Output API), not `.output/public`; `studio/build.mjs` picks whichever exists. That output ignores `vercel.json` rewrites and headers, so the `/admin` routing (page paths serve the studio's `index.html`) and its `noindex` header are in `nitro.vercel.config.routes` in `nuxt.config.ts`. Locally, `npm run admin` runs the studio at http://localhost:3333/admin/.
- Add the site's domains (and http://localhost:3333) as CORS origins with credentials in sanity.io/manage → API, or the studio can't log in.

### Coming soon and maintenance

- `NUXT_PUBLIC_SITE_MODE=coming-soon` or `maintenance` (build setting, then redeploy) swaps every page, and the 404 page, for `<HoldingPage>` (`app.vue`, `error.vue`): full-screen, with the phone, email, address, open/closed line and services kept up front, plus the pressure gauge (`<ErrorGauge>` climbing to "SOON", or resting at "503"). Copy is in `holding` in the content. `/admin` keeps working, so staff can still edit.
- **Maintenance on Vercel** also returns **503 with `Retry-After`** for every page URL (`nitro.vercel.config.routes` in `nuxt.config.ts`), so search engines treat it as temporary rather than dropping pages. Without it, URLs other than the prerendered few would be 404s. Keep maintenance short.
- Preview the designs at `/coming-soon` and `/maintenance` (and `/cy/…`): prerendered, `noindex`, not linked and excluded from the sitemap.
- **Indexing:** in coming-soon mode the page is `index, follow` with the LocalBusiness data, so the domain and phone number can appear in Google before launch (Lighthouse SEO 100). Maintenance relies on the 503, never `noindex`, so Google can't drop the real pages. Only the preview URLs are `noindex` (`preview` prop).
- `useSiteHead()` (called by the layout and `<HoldingPage>`) sets `<html lang>`, canonical, hreflang and the LocalBusiness JSON-LD. Anything rendered outside the layout must call it.

### Booking, trade accounts and customer login

- CHS uses **Fergus** for job management. The site stays static: booking and customer accounts live in Fergus, and the site links to them.
- **Live booking (Kwik Fit style)** on `/book` when `NUXT_FERGUS_API_TOKEN` is set (or `NUXT_FERGUS_MOCK=true`) in a **server build**. `server/api/booking/slots.get.ts` reads the Fergus calendar (Open API, `server/utils/fergus.ts`) and returns free slots, cached for a minute (Fergus allows 100 requests a minute); `server/api/booking/index.post.ts` re-checks the slot against a fresh calendar (409 if taken), finds or creates the customer, creates an **active** job (Fergus needs a site for that: the "CHS workshop (Cross Hands)" site, created once, or a new site from the on-site location; it falls back to a draft only if Fergus refuses) and the calendar event, linked to the job through its first phase so the booking opens the job from the Fergus calendar. The business summary email includes the Fergus job number. The rules (services, durations, capacity, notice, drop-off windows) and the slot maths are in `shared/utils/booking.ts`, shared by server and page: **starting values, to be replaced from the "Online Booking: Rules Worksheet" in Notion.** Bookings are recognised in the calendar by their `Web booking:` title. `<BookingPicker>` is the UI; anything not bookable ("Something else?", or when the diary can't load) goes to the contact form. **While live booking is off there's no `/book`:** it isn't prerendered or in the sitemap, and `useBookingLink()` reports `available: false`, so the homepage, CTA band, service pages, contact page and footer show their usual buttons (call, send an enquiry, our services) instead of "Book online". Service pages pre-select their job (`/book?service=…`, `bookingServiceForPage`).
- **After booking:** the customer gets a confirmation email in their language (`bookPage.email` in the content) with what to bring and a calendar invite attached, and the business gets the summary (reply-to the customer), both through Resend (`server/utils/email.ts`). Without `NUXT_RESEND_API_KEY` the customer email is skipped and the summary goes through the form service. The confirmation screen has "Add to calendar" (.ics download) and "Google Calendar" buttons (`shared/utils/ics.ts`), and only says "We've emailed…" when an email was actually sent.
- **Builds:** Vercel runs `npm run build` (`nuxt build`: pages still prerendered, plus the booking functions; `vercel.json`). `npm run generate` still makes a fully static site, with live booking off.
- **`/accounts`:** trade accounts for plant hire, contractors and farms. The benefits are drafted and the payment terms are a [placeholder] (the build warns): check them with CHS.
- **`/login`:** a gateway to the Fergus customer portal. Only built and linked when `NUXT_PUBLIC_FERGUS_PORTAL_URL` is set (`nuxt.config.ts` skips prerendering it otherwise, because the prerenderer visits every page file); always `noindex` and out of the sitemap.
- **Forms** (`contact`, `book`) send through `useEnquirySubmit()` (endpoint, language field, `_subject`, honeypot, Plausible event, scroll to the result). Every `UFormField` uses **`eager-validation`**: without it, a corrected field's error only clears on blur, the form shrinks as the visitor clicks Send, and the click misses the button.

### Analytics

`app/plugins/analytics.client.ts` provides `$track(event, props)`, which does nothing when Plausible is disabled. Current events: `Phone Call`, `Email Click` (automatic on `tel:` / `mailto:` clicks), `Enquiry Sent` (contact form success) and `Booking Made` (online booking). Each needs a matching goal in Plausible.

## Gotchas already hit

- **`Cannot find native binding`** on build/dev: npm bug with optional dependencies (npm/cli#4828), even on npm 11.6. It can happen after any `npm install <pkg>`. Fix: `rm -rf node_modules package-lock.json && npm install`. Don't add platform-specific binding packages to `package.json`.
- **Query params on prerendered pages:** `/contact` is prerendered without a query, so on a direct load `?service=` is empty while hydrating. Read it from `useRouter().currentRoute` in `onMounted` and `watch` it (see `contact.vue`).
- **Hash links and the sticky header:** `[id]` elements get `scroll-margin-top: var(--ui-header-height)`. Pages with extra sticky bars (e.g. `/sectors`) add more.
- **Plausible ignores `localhost` and automated browsers** (`navigator.webdriver`). To test events: map the real domain to localhost (Chromium `--host-resolver-rules`) and set `window.__plausible = true`.
- **Lighthouse:** measure the `npm run generate` output with a server that compresses responses (e.g. `npx serve`), never `npm run dev`. The current baseline is about 92 performance and 100 accessibility, best practices and SEO on mobile. The ~140 KB of JS for Nuxt UI hydration is the main cost.

## Content and launch caveats

- **Business details:** the phone (01269 831491) and address (3 Acer Court, Cross Hands, Llanelli SA14 6RB) are confirmed. Still placeholders: email, hours, service area and the domain `chshydraulics.co.uk`. They live in `app/app.config.ts` and `nuxt.config.ts`. They must match the Google Business Profile exactly before launch. Some public listings still show an old address (Unit 3 Cross Hands Business Park, Heol Parc Mawr, SA14 6RE) or the name "Cross Hands Hydraulics": get those corrected to match the site.
- **The company:** CHS Hydraulics is run by **Roberts Commercial Group Ltd** (`business.legalName`), which took the business over from Crosshands Hydraulic Services LLP (`formerName`, kept in JSON-LD so old listings link up). A company's website must show its registered name, number, place of registration and registered office: the footer does (`footer.company`), from `business.company` in `app.config.ts`, which is still placeholders (the build warns). Confirm the exact registered name (e.g. "Ltd") at Companies House.
- **Privacy notice** at `/privacy` (`privacyPage` in the content; linked from the footer and under the contact form). Drafted from what the site does: placeholders for the ICO registration number, the form service and retention periods (the build warns). Update `privacyPage.updated` whenever it changes, and the notice itself if the site starts collecting anything new.
- **Founders are placeholders:** `business.founders` (names like `[Founder 1]`) and `business.foundersPhoto` (one photo of both, 4:3; empty shows a dashed placeholder panel) in `app.config.ts`, and the About "Our story" copy in `app/content/<locale>/index.ts` (`about.story`, `about.foundersQuote`). Copy refers to them as `{founder1}`/`{founder2}` (and the year as `{founded}`, from `business.foundingYear`). `npm run generate` warns while names are still in brackets, and bracketed names are kept out of the LocalBusiness `founder` JSON-LD. Get the founders' permission before publishing names or photos.
- **ISO 9001 certification:** `business.certification` in `app.config.ts` feeds the footer `<CertificationBadge>`, the About facts, a Why CHS promise and the LocalBusiness `hasCredential`. Set the real `certificateNumber` and `mark` (the official URS/UKAS combined mark from URS's logo pack; until then a text badge shows). Never use the UKAS or ISO logos on their own. ISO's rules (iso.org/iso-name-and-logo.html): never use the ISO logo, never say "certified by ISO" (certification bodies like URS certify), and always give the full reference ("ISO 9001:2015", via the `{standard}` token). Confirm the certificate is current and its scope covers what the site sells. The build warns until both are set.
- **The About timeline is placeholders too:** `about.timeline` in `app/content/<locale>/index.ts` (only the 1991 founding and the 2026 rebrand are real). Entries are free to add or remove; `upcoming: true` shows an entry greyed out as next, and `onsite: true` hides it while `features.onsite` is off. The build warns while any date or title is in [brackets].
- **Contact map:** `<ContactMap>` shows a static preview (`public/images/map-cross-hands.jpg`, OpenStreetMap tiles, greyscale with a red pin, drawn around `business.geo`) and only loads the live Google map when the visitor clicks, so the site stays cookie-free (no consent banner) and fast. Keep the OpenStreetMap credit on the preview. `business.geo` is currently the approximate postcode point: set the exact coordinates and regenerate the image. The "Finding us" directions (`contact.map.findingUsText`) are a placeholder; the build warns.
- The address is shown on the contact page (with a Google Maps link) and in the footer via `addressLines()` (`app/utils/address.ts`), and output in JSON-LD. The street address is only output in JSON-LD while `address.street` and `address.postcode` are set.
- **Service, sector, benefit and About content was drafted, not supplied by the business.** Claims (e.g. "Established 1991", "while you wait" turnaround, machine lists) must be checked with CHS. Never invent reviews or testimonials; the admin area has none until real ones exist.
- `public/images/` are low-resolution crops from the design mockup; replace them with real photography. `hero-hydraulic.jpg`, `industrial-bg.jpg`, `service-van.png` and `chs-logo-source.jpg` are unused originals kept as sources.

## Before finishing a change

1. `npx nuxt typecheck` passes and `npm run format:check` is clean.
2. `npm run generate` succeeds.
3. For UI changes, check desktop (1440), tablet (820) and mobile (390) widths: no horizontal overflow, no console errors.
