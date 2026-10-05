import { closures, openingHours } from "#chs-hours"
import type { BookingService } from "#shared/utils/booking"

// Opening hours for the booking API, in the shape computeSlots() wants: the admin area's hours
// (else app.config `openingHours`) and holiday closures, as on the website.
export function bookingHours() {
  const { business } = useAppConfig()
  const week: ({ open: number; close: number } | null)[] = Array(7).fill(null)
  for (const { from, to, open, close } of parseOpeningHours(
    openingHours ?? business.openingHours,
  ))
    for (let d = from; d <= to; d++) week[d] = { open, close }
  return { week, closures }
}

// Where Nitro keeps the cached slots for a service (defineCachedEventHandler in
// server/api/booking/slots.get.ts, named "booking-slots").
export const slotsCacheKey = (service: string) =>
  `/cache:nitro/handlers:booking-slots:${service}.json`

// On-site visits can't be booked (or even looked up) until on-site work is live.
export function refuseUnavailable(service: string) {
  const { features } = useAppConfig()
  if (
    !availableBookingServices(features.onsite).includes(
      service as BookingService,
    )
  )
    throw createError({ statusCode: 404, statusMessage: "Not available" })
}
