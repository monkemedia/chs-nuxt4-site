import { googleRating, reviews } from "~/data/reviews"

// Reviews, Google rating and Google links for <ReviewsSection> and <GoogleRatingBadge>.
// With no reviews both render nothing.
export function useReviews() {
  const { business } = useAppConfig()

  // Google links need the Place ID.
  const placeId = business.googlePlaceId
  const readUrl = placeId
    ? `https://search.google.com/local/reviews?placeid=${placeId}`
    : ""
  const writeUrl = placeId
    ? `https://search.google.com/local/writereview?placeid=${placeId}`
    : ""

  return { allReviews: reviews, summary: googleRating, readUrl, writeUrl }
}
