import { join } from "node:path"
import { addTypeTemplate, addVitePlugin, defineNuxtModule } from "nuxt/kit"
import * as z from "zod"
import {
  googleRatingSchema,
  reviewSchema,
  type Review,
} from "../app/data/reviews-schema"
import { fetchSanityContent } from "./lib/sanity"

// Loads reviews and the overall Google rating from Sanity (the admin area at /admin) at
// build time, validates them and serves them as `virtual:chs-reviews`. Invalid entries are
// skipped with a build warning.
export default defineNuxtModule({
  meta: { name: "reviews" },
  async setup(_, nuxt) {
    const drafts =
      nuxt.options.dev || process.env.NUXT_PUBLIC_SHOW_DRAFTS === "true"
    const content = await fetchSanityContent(drafts)

    const reviews: Review[] = []
    for (const data of content.reviews) {
      const parsed = reviewSchema.safeParse(data)
      if (parsed.success) reviews.push(parsed.data)
      else
        console.warn(
          `[reviews] Skipped a review: ${z.prettifyError(parsed.error)}`,
        )
    }
    reviews.sort((a, b) => b.date.localeCompare(a.date))
    const rating = googleRatingSchema.safeParse(content.googleRating)
    const googleRating = rating.success ? rating.data : null

    // No "#" in the id: in dev it becomes part of a URL, where "#" starts the fragment.
    const id = "virtual:chs-reviews"
    addVitePlugin({
      name: "chs-reviews",
      resolveId: (source) => (source === id ? `\0${id}` : undefined),
      load: (resolved) =>
        resolved === `\0${id}`
          ? `export const reviews = ${JSON.stringify(reviews)}\nexport const googleRating = ${JSON.stringify(googleRating)}`
          : undefined,
    })
    addTypeTemplate({
      filename: "types/reviews.d.ts",
      getContents: () =>
        `declare module "virtual:chs-reviews" {\n  export const reviews: import("${join(nuxt.options.rootDir, "app/data/reviews-schema")}").Review[]\n  export const googleRating: { rating: number; count: number } | null\n}\n`,
    })
  },
})
