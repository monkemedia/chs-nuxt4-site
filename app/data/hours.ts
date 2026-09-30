// Opening hours and holiday closures. Staff set them in the admin area (/admin, Sanity);
// modules/hours.ts checks them at build time. Use useOpeningHours(), which falls back to
// app.config `openingHours` while the admin area has none.

export type { Closure } from "./hours-schema"

// Schema.org format ("Mo-Fr 08:00-17:30"), or null to use app.config. Closures that haven't
// ended yet (at build time), soonest first.
export { closures, openingHours } from "virtual:chs-hours"
