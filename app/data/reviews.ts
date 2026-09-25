// Customer reviews and testimonials shown by <ReviewsSection> on the homepage and /why-chs.
//
// Only ever add REAL reviews:
// - Google reviews: copy the reviewer's name, star rating, text and date exactly as shown on
//   the Google Business Profile.
// - Testimonials: collected directly from the customer, with their permission to publish
//   their name (and company).
// Fake or edited reviews breach UK consumer law (CMA) and Google's policies.
//
// While `reviews` is empty the sections are hidden on the live site. `npm run dev` shows
// labelled samples instead (see reviews.sample.ts) so the design can be previewed.

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

export const reviews: Review[] = []

// Overall rating from the Google Business Profile. Update by hand when it changes
// (or null to hide the summary).
export const googleRating: { rating: number; count: number } | null = null

// The homepage hero rating badge only appears once the Google rating is convincing:
// "5.0 from 2 reviews" looks thin and can put people off.
export const ratingBadgeThreshold = { minReviews: 10, minRating: 4.5 }
