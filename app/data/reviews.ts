// Customer reviews and testimonials shown by <ReviewsSection> on the homepage and /why-chs.
//
// Only ever add REAL reviews:
// - Google reviews: copy the reviewer's name, star rating, text and date exactly as shown on
//   the Google Business Profile.
// - Testimonials: collected directly from the customer, with their permission to publish
//   their name (and company).
// Fake or edited reviews breach UK consumer law (CMA) and Google's policies.
//
// Staff add reviews and the overall Google rating in the admin area (/admin, Sanity).
// modules/reviews.ts fetches and checks them at build time; an invalid one is skipped with a
// build warning rather than breaking the deploy.
//
// While `reviews` is empty the sections are hidden.

export type { Review } from "./reviews-schema"

// Newest first. Null rating (hiding the summary) until both numbers are filled in.
export { googleRating, reviews } from "virtual:chs-reviews"

// The homepage hero rating badge only appears once the Google rating is convincing:
// "5.0 from 2 reviews" looks thin and can put people off.
export const ratingBadgeThreshold = { minReviews: 10, minRating: 4.5 }
