import * as z from "zod"

// Shape of the review files Pages CMS saves (.pages.yml): app/data/reviews/*.json and
// app/data/google-rating.json. Checked at build time by modules/reviews.ts, so zod never
// reaches the browser. Kept free of Nuxt/Vite imports.

export interface Review {
  author: string
  // Company or role, for testimonials (e.g. "Site manager, Jones Groundworks").
  company?: string
  // 1–5 stars. Testimonials without a star rating can omit it.
  rating?: number
  text: string
  // ISO date (YYYY-MM-DD), shown as month and year.
  date: string
  source: "google" | "testimonial"
}

// The CMS saves empty fields as "" or null, so those count as missing.
const empty = (value: unknown) =>
  value === "" || value === null ? undefined : value

export const reviewSchema = z.object({
  author: z.string().trim().min(1),
  company: z.preprocess(empty, z.string().trim().optional()),
  rating: z.preprocess(empty, z.coerce.number().int().min(1).max(5).optional()),
  text: z.string().trim().min(1),
  date: z.iso.date(),
  source: z.enum(["google", "testimonial"]),
})

export const googleRatingSchema = z.object({
  rating: z.coerce.number().min(1).max(5),
  count: z.coerce.number().int().min(1),
})
