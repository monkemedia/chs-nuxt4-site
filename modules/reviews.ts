import { existsSync, readdirSync, readFileSync } from "node:fs"
import { join } from "node:path"
import { addTypeTemplate, addVitePlugin, defineNuxtModule } from "nuxt/kit"
import * as z from "zod"
import {
  googleRatingSchema,
  reviewSchema,
  type Review,
} from "../app/data/reviews-schema"

// Loads reviews from app/data/reviews/*.json and the overall rating from
// app/data/google-rating.json (both edited in Pages CMS), validates them at build time and
// serves them as `virtual:chs-reviews`. Invalid files are skipped with a build warning.
export default defineNuxtModule({
  meta: { name: "reviews" },
  setup(_, nuxt) {
    const dir = join(nuxt.options.rootDir, "app/data/reviews")
    const ratingPath = join(nuxt.options.rootDir, "app/data/google-rating.json")

    const readJson = (path: string): unknown => {
      try {
        return JSON.parse(readFileSync(path, "utf8"))
      } catch {
        return undefined
      }
    }

    const load = () => {
      const reviews: Review[] = []
      for (const file of readdirSync(dir).filter((f) => f.endsWith(".json"))) {
        const parsed = reviewSchema.safeParse(readJson(join(dir, file)))
        if (parsed.success) reviews.push(parsed.data)
        else
          console.warn(
            `[reviews] Skipped ${file}: ${z.prettifyError(parsed.error)}`,
          )
      }
      reviews.sort((a, b) => b.date.localeCompare(a.date))
      const rating = googleRatingSchema.safeParse(
        existsSync(ratingPath) ? readJson(ratingPath) : undefined,
      )
      return { reviews, googleRating: rating.success ? rating.data : null }
    }

    // No "#" in the id: in dev it becomes part of a URL, where "#" starts the fragment.
    const id = "virtual:chs-reviews"
    addVitePlugin({
      name: "chs-reviews",
      resolveId: (source) => (source === id ? `\0${id}` : undefined),
      load(resolved) {
        if (resolved !== `\0${id}`) return
        this.addWatchFile(dir)
        this.addWatchFile(ratingPath)
        for (const file of readdirSync(dir)) this.addWatchFile(join(dir, file))
        const { reviews, googleRating } = load()
        return `export const reviews = ${JSON.stringify(reviews)}\nexport const googleRating = ${JSON.stringify(googleRating)}`
      },
    })
    addTypeTemplate({
      filename: "types/reviews.d.ts",
      getContents: () =>
        `declare module "virtual:chs-reviews" {\n  export const reviews: import("${join(nuxt.options.rootDir, "app/data/reviews-schema")}").Review[]\n  export const googleRating: { rating: number; count: number } | null\n}\n`,
    })
  },
})
