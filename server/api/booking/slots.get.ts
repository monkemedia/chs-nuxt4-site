import dayjs from "dayjs/esm"
import * as z from "zod"

// Free booking slots for a service, from the Fergus calendar: GET /api/booking/slots?service=hose
// Cached for a minute (Fergus allows 100 requests a minute for the whole company). The booking
// itself re-checks the slot against a fresh calendar, so a stale minute can't double-book.
const query = z.object({ service: z.enum(bookingServices) })

export default defineCachedEventHandler(
  async (event) => {
    const { service } = await getValidatedQuery(event, query.parse)
    refuseUnavailable(service)
    const now = dayjs().tz("Europe/London")
    const events = await fergusBusyEvents(now.format("YYYY-MM-DD"))
    return { days: computeSlots(service, events, bookingHours(), now) }
  },
  {
    maxAge: 60,
    // Cleared after each booking (see slotsCacheKey).
    name: "booking-slots",
    getKey: (event) => String(getQuery(event).service),
  },
)
