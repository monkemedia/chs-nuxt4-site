import type { Review } from "./reviews"

// DEV PREVIEW ONLY. Placeholder content so the reviews design can be seen under `npm run dev`
// before real reviews exist. <ReviewsSection> only uses these when `import.meta.dev` is true,
// so they are never included in a production build. Never copy these into reviews.ts.

export const sampleReviews: Review[] = [
  {
    author: "Sample reviewer",
    rating: 5,
    text: "Sample review text. A real Google review would appear here, copied exactly as the customer wrote it.",
    date: "2026-08-14",
    source: "google",
  },
  {
    author: "Sample customer",
    company: "Sample company",
    text: "Sample testimonial text. A real testimonial, collected from a customer with their permission, would appear here.",
    date: "2026-07-02",
    source: "testimonial",
  },
  {
    author: "Sample reviewer",
    rating: 4,
    text: "Another sample review. Longer reviews wrap onto more lines and the cards keep an even height across the row.",
    date: "2026-06-21",
    source: "google",
  },
]

export const sampleGoogleRating = { rating: 4.8, count: 12 }
