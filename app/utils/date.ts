// Import dayjs, its plugins and locales all from the ESM build so they share one instance.
import dayjs from "dayjs/esm"
import cy from "dayjs/esm/locale/cy"
import enGb from "dayjs/esm/locale/en-gb"
import timezone from "dayjs/esm/plugin/timezone"
import utc from "dayjs/esm/plugin/utc"

// dayjs with time zone support and the site's locales (content `dateLocale`).
// Auto-imported: use `dayjs` directly in components and composables.
dayjs.extend(utc)
dayjs.extend(timezone)
// Register the locales on this instance explicitly: when prerendering, the locale files'
// own registration can reach a different dayjs copy, so Welsh dates rendered in English
// and then changed on hydration.
dayjs.locale(cy, undefined, true)
dayjs.locale(enGb, undefined, true)

// Opening hours are in UK time wherever the visitor is.
export const businessTimeZone = "Europe/London"

export { dayjs }
