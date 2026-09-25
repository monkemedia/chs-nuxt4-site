# CHS Hydraulic Services — Nuxt 4 static site

A static, SEO-first Nuxt 4 marketing site based on the approved CHS homepage direction.

## Run locally

```bash
npm install
cp .env.example .env   # optional: contact form endpoint and Plausible domain
npm run dev
```

## Generate static production output

```bash
npm run generate
```

Environment variables are read at build time, so set `NUXT_PUBLIC_CONTACT_FORM_ENDPOINT` and `NUXT_PUBLIC_PLAUSIBLE_DOMAIN` in your host's build settings (see `.env.example`).

Deploy `.output/public/` to Netlify, Cloudflare Pages, GitHub Pages (with routing configured), S3/CloudFront, or any static host.

## Services content

Service pages (`/services/<slug>`), the homepage cards, footer links and the contact form's service list all come from `app/data/services.ts`. Add a service there and its page is generated automatically. Have the business check every claim before launch.

## Contact form

The site is static, so `/contact` posts to a hosted form service. It works with any service that accepts a `FormData` POST and returns 2xx for success (e.g. Formspree, Basin, Getform). Set the endpoint at build time:

```bash
NUXT_PUBLIC_CONTACT_FORM_ENDPOINT=https://formspree.io/f/yourFormId npm run generate
```

Without it, the form shows an error asking visitors to call. The form includes a `_gotcha` honeypot field and a `_subject` line (Formspree conventions).

## Analytics

[Plausible](https://plausible.io) (cookie-free, so no consent banner needed), wired up in `app/plugins/analytics.client.ts`. It only runs when the domain is set at build time:

```bash
NUXT_PUBLIC_PLAUSIBLE_DOMAIN=www.chshydraulics.co.uk npm run generate
```

Pageviews are tracked automatically. Custom events: add each as a goal in Plausible (Site settings → Goals → Custom event) to see it on the dashboard:

| Goal           | Fires when                            | Properties           |
| -------------- | ------------------------------------- | -------------------- |
| `Phone Call`   | any `tel:` link is clicked            | `page`               |
| `Email Click`  | any `mailto:` link is clicked         | `page`               |
| `Enquiry Sent` | the contact form is sent successfully | `service`, `urgency` |

Add `page`, `service` and `urgency` under Site settings → Custom properties to break goals down by them. Outbound link clicks are tracked too (enable the "Outbound Link: Click" goal). To exclude your own visits, run `localStorage.plausible_ignore = 'true'` in the browser console on the live site.

## Troubleshooting

`Cannot find native binding` on build or dev: an npm bug with optional dependencies (npm/cli#4828) that can hit after `npm install <package>`. Fix with `rm -rf node_modules package-lock.json && npm install`.

## Before launch

Replace the placeholder business details (phone, email, location, opening hours, service area) in `app/app.config.ts`, and the canonical domain in `nuxt.config.ts`, the page SEO blocks and `public/robots.txt`. Replace the cropped concept imagery in `public/images/` with final licensed/original photography. The current images are design-development assets derived from the approved concept board.

## Stack

- **Nuxt 4** static generation (`npm run generate`), **Nuxt UI 4** components and **Tailwind CSS v4**.
- Theme tokens (brand `chs` red scale, `ink` near-blacks, fonts, radius) live in `app/assets/css/main.css`; Nuxt UI colour aliases and component defaults in `app/app.config.ts`.
- Icons are Lucide via `UIcon`, bundled at build time (no icon API needed on a static host). Custom icons go in `app/assets/icons/` and are used as `i-chs-<name>`.
- Nuxt UI's colour-mode and web-font modules are disabled: the design is light-only with system fonts.

## Performance

Mobile Lighthouse (production build): ~92 performance and 100 accessibility, best practices and SEO. Every page hydrates Vue for Nuxt UI (header slide-over menu, accordion, form), which costs roughly 140 KB of compressed JS; that is what holds performance in the low 90s. Always measure `npm run generate` output, not `npm run dev`.

- `@nuxt/image` AVIF/WebP at each image's native size (the source images are small, so larger sizes would only upscale). Hero images are real `<img>` elements, preloaded with `fetchpriority="high"`.
- Explicit image dimensions and lazy loading below the fold to reduce CLS and bandwidth.
- `public/_headers` sets long-lived cache headers on Netlify / Cloudflare Pages; set the equivalent on other hosts.
- System fonts only: no render-blocking web-font requests.
- Reduced-motion support.

## SEO/accessibility

- Semantic landmarks and headings.
- Skip link and visible keyboard focus behavior.
- Descriptive image alt text.
- Canonical, Open Graph, Twitter metadata.
- LocalBusiness JSON-LD on every page (from `app/app.config.ts`); Service and BreadcrumbList JSON-LD on service pages.
- Per-page titles, descriptions and canonicals via `usePageSeo()`.
- `robots.txt` and XML sitemap support.
- UK English language declaration.
