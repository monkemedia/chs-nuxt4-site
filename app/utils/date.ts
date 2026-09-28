// Import dayjs, its plugins and locales all from the ESM build so they share one instance.
import dayjs from "dayjs/esm"
import "dayjs/esm/locale/cy"
import "dayjs/esm/locale/en-gb"
import timezone from "dayjs/esm/plugin/timezone"
import utc from "dayjs/esm/plugin/utc"

// dayjs with time zone support and the site's locales (content `dateLocale`).
// Auto-imported: use `dayjs` directly in components and composables.
dayjs.extend(utc)
dayjs.extend(timezone)

// Opening hours are in UK time wherever the visitor is.
export const businessTimeZone = "Europe/London"

export { dayjs }
