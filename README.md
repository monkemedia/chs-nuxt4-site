# CHS Hydraulic Services — Nuxt 4 static site

A static, SEO-first Nuxt 4 marketing site based on the approved CHS homepage direction.

## Run locally

```bash
npm install
npm run dev
```

## Generate static production output

```bash
npm run generate
```

Deploy `.output/public/` to Netlify, Cloudflare Pages, GitHub Pages (with routing configured), S3/CloudFront, or any static host.

## Services content

Service pages (`/services/<slug>`), the homepage cards, footer links and the contact form's service list all come from `app/data/services.ts`. Add a service there and its page is generated automatically. Have the business check every claim before launch.

## Contact form

The site is static, so `/contact` posts to a hosted form service. It works with any service that accepts a `FormData` POST and returns 2xx for success (e.g. Formspree, Basin, Getform). Set the endpoint at build time:

```bash
NUXT_PUBLIC_CONTACT_FORM_ENDPOINT=https://formspree.io/f/yourFormId npm run generate
```

Without it, the form shows an error asking visitors to call. The form includes a `_gotcha` honeypot field and a `_subject` line (Formspree conventions).

## Before launch

Replace the placeholder business details (phone, email, location, opening hours, service area) in `app/app.config.ts`, and the canonical domain in `nuxt.config.ts`, the page SEO blocks and `public/robots.txt`. Replace the cropped concept imagery in `public/images/` with final licensed/original photography. The current images are design-development assets derived from the approved concept board.

## Performance choices

Mobile Lighthouse (production build): 100 across all categories on the homepage and service pages, 99 performance on `/contact`. Always measure `npm run generate` output, not `npm run dev`, which is unbundled and much slower.

- Full static generation with SSR/prerendering for indexable HTML.
- Home and service pages use Nuxt `noScripts`: no Nuxt/Vue bundle is shipped. Only `/contact` hydrates, for the form.
- The burger menu is a ~1 KB inline script in `AppHeader.vue`, so it works with or without the Nuxt bundle.
- Global CSS is imported in `app.vue` (not `nuxt.config` `css`) so it is inlined into the HTML rather than render-blocking.
- `@nuxt/image` AVIF/WebP at each image's native size (the source images are small, so larger sizes would only upscale). Hero images are real `<img>` elements, preloaded with `fetchpriority="high"`.
- Explicit image dimensions and lazy loading below the fold to reduce CLS and bandwidth.
- `public/_headers` sets long-lived cache headers on Netlify / Cloudflare Pages; set the equivalent on other hosts.
- System fonts only: no render-blocking web-font requests.
- Minimal CSS, no UI framework, no icon library.
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
