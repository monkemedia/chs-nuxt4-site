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

// A town or area page (/areas/<slug>): local search ("hydraulic repairs Swansea") with real
// local detail, not a copy of another town's page with the name swapped.
export interface Area {
  slug: string
  // As written in the copy and matched against job locations ("Swansea").
  town: string
  // "from Swansea" / "in Swansea". Welsh mutates the name ("o Gaerfyrddin", "yng
  // Nghaerfyrddin"), so labels use these rather than adding a word to `town`.
  fromTown: string
  inTown: string
  metaTitle: string
  metaDescription: string
  h1: string
  lead: string
  intro: string[]
  // Getting to the Cross Hands workshop from here.
  travel: { distance: string; time: string; route: string }
  // Places nearby, shown as "Also covering".
  nearby: string[]
  faqs: { q: string; a: string }[]
}
