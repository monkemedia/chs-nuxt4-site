import { googleRating, reviews } from "~/data/reviews"
import { sampleGoogleRating, sampleReviews } from "~/data/reviews.sample"

// Reviews, Google rating and Google links for <ReviewsSection> and <GoogleRatingBadge>.
// Until real reviews are added, dev builds use labelled samples so the design can be
// previewed; production renders nothing. `import.meta.dev` is written out in each
// expression (not only via showSamples) so the bundler can see it's false in production
// and drop the sample data entirely.
export function useReviews() {
  const { business } = useAppConfig()

  const showSamples = import.meta.dev && reviews.length === 0
  const allReviews =
    import.meta.dev && reviews.length === 0 ? sampleReviews : reviews
  const summary =
    import.meta.dev && reviews.length === 0 ? sampleGoogleRating : googleRating

  // Google links need the Place ID; dev previews show them with dummy links.
  const placeId = business.googlePlaceId
  const readUrl = placeId
    ? `https://search.google.com/local/reviews?placeid=${placeId}`
    : showSamples
      ? "#"
      : ""
  const writeUrl = placeId
    ? `https://search.google.com/local/writereview?placeid=${placeId}`
    : showSamples
      ? "#"
      : ""

  return { showSamples, allReviews, summary, readUrl, writeUrl }
}
