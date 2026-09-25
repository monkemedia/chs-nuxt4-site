// Shapes shared by every language in app/content/<locale>/. Each locale must provide
// the same services, sectors and benefits (same slugs, same order); useContent()
// checks this at build time.

export interface Service {
  slug: string
  title: string
  icon: string
  image: string
  alt: string
  summary: string
  metaTitle: string
  metaDescription: string
  h1: string
  lead: string
  intro: string[]
  includes: string[]
  process: { title: string; text: string }[]
  faqs: { q: string; a: string }[]
}

export interface Sector {
  slug: string
  icon: string
  // Two-line label for the homepage band.
  label: [string] | [string, string]
  title: string
  summary: string
  machines: string[]
  // Service slugs.
  services: string[]
}

export interface Benefit {
  icon: string
  // Two-line title for the homepage band.
  title: [string, string]
  summary: string
  detail: string
}
