// Fetches the admin area's content from Sanity at build time (one request per build, shared
// by modules/jobs.ts, modules/reviews.ts and modules/vacancies.ts). The site stays static: nothing is fetched in
// the browser, and the read token below never leaves the build.
//
// SANITY_STUDIO_PROJECT_ID / SANITY_STUDIO_DATASET: the Sanity project (also used by the
//   studio at /admin). Unset: no content, with a build warning.
// SANITY_READ_TOKEN: preview builds only (NUXT_PUBLIC_SHOW_DRAFTS=true), to read drafts.
//   Secret: set it in the host's build settings, never in a NUXT_PUBLIC_ variable.

export interface SanityContent {
  jobs: unknown[]
  reviews: unknown[]
  googleRating: unknown
  vacancies: unknown[]
  openingHours: unknown
}

const apiVersion = "v2025-02-19"

const query = `{
  "jobs": *[_type == "job"] {
    "draft": _originalId in path("drafts.**"),
    "slug": slug.current,
    date,
    service,
    "image": image.asset->url,
    en,
    cy
  },
  "reviews": *[_type == "review"] { author, company, rating, text, date, source },
  "googleRating": *[_id == "googleRating"][0] { rating, count },
  "openingHours": *[_id == "openingHours"][0] {
    monday, tuesday, wednesday, thursday, friday, saturday, sunday, closures
  },
  "vacancies": *[_type == "vacancy"] {
    "draft": _originalId in path("drafts.**"),
    "slug": slug.current,
    posted,
    closes,
    type,
    salaryMin,
    salaryMax,
    salaryPeriod,
    en,
    cy
  }
}`

let cached: Promise<SanityContent> | undefined

export function fetchSanityContent(drafts: boolean): Promise<SanityContent> {
  cached ??= load(drafts)
  return cached
}

async function load(drafts: boolean): Promise<SanityContent> {
  const empty = {
    jobs: [],
    reviews: [],
    googleRating: null,
    vacancies: [],
    openingHours: null,
  }
  const projectId = process.env.SANITY_STUDIO_PROJECT_ID
  const dataset = process.env.SANITY_STUDIO_DATASET || "production"
  if (!projectId) {
    console.warn(
      "[sanity] SANITY_STUDIO_PROJECT_ID isn't set: building without jobs, reviews or vacancies.",
    )
    return empty
  }

  const token = process.env.SANITY_READ_TOKEN
  if (drafts && !token)
    console.warn(
      "[sanity] Drafts need SANITY_READ_TOKEN: showing published content only.",
    )
  const withDrafts = drafts && !!token
  // Published content comes from the CDN; drafts need the live API and the token.
  const host = withDrafts ? "api.sanity.io" : "apicdn.sanity.io"
  const url = new URL(
    `https://${projectId}.${host}/${apiVersion}/data/query/${dataset}`,
  )
  url.searchParams.set("query", query)
  url.searchParams.set("perspective", withDrafts ? "drafts" : "published")

  const response = await fetch(url, {
    headers: withDrafts ? { Authorization: `Bearer ${token}` } : {},
  })
  // Fail the build rather than publish a site with the jobs and reviews missing.
  if (!response.ok)
    throw new Error(
      `[sanity] Couldn't load content (${response.status}): ${await response.text()}`,
    )
  const { result } = (await response.json()) as { result: SanityContent }
  return result
}
