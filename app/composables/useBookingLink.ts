import type { BookingService } from "#shared/utils/booking"

// "Book online" buttons. They only exist while there's somewhere to book: the site's own live
// booking (/book, with a service pre-selected), or Fergus's hosted booking page
// (NUXT_PUBLIC_FERGUS_BOOKING_URL). Otherwise `available` is false and callers show their
// usual buttons (call, send an enquiry) instead.
export function useBookingLink() {
  const runtimeConfig = useRuntimeConfig()
  const content = useContent()
  const localePath = useLocalePath()
  const live = runtimeConfig.public.liveBooking as boolean
  const hosted = runtimeConfig.public.fergusBookingUrl as string

  const available = live || !!hosted
  const label = computed(() => content.value.common.bookOnline)
  const to = (service?: BookingService) =>
    live ? localePath(service ? `/book?service=${service}` : "/book") : hosted

  return { available, label, to }
}
