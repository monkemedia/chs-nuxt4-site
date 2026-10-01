import { cy } from "./cy"
import { workshop as cyWorkshop } from "./cy/workshop"
import { en } from "./en"
import { workshop as enWorkshop } from "./en/workshop"

export type { Content } from "./en"

export const contentByLocale = { en, cy }
export type LocaleCode = keyof typeof contentByLocale

// Workshop-only copy per locale, applied while app.config `features.onsite` is off.
export const workshopByLocale = { en: enWorkshop, cy: cyWorkshop }
// The service (and its page) hidden while on-site work isn't live.
export const onsiteServiceSlug = "on-site-hydraulic-service"

// Every locale must list the same services, sectors, benefits and areas in the same order
// (slugs drive URLs and links). Checked when the server/prerender loads this module,
// so a mismatch fails the build instead of shipping broken links.
if (import.meta.server) {
  for (const [code, content] of Object.entries(contentByLocale)) {
    const same = (a: unknown, b: unknown) =>
      JSON.stringify(a) === JSON.stringify(b)
    const checks = {
      services: same(
        content.services.map((s) => s.slug),
        en.services.map((s) => s.slug),
      ),
      sectors: same(
        content.sectors.map((s) => [s.slug, s.services]),
        en.sectors.map((s) => [s.slug, s.services]),
      ),
      benefits: content.benefits.length === en.benefits.length,
      areas: same(
        content.areas.map((a) => a.slug),
        en.areas.map((a) => a.slug),
      ),
    }
    for (const [part, ok] of Object.entries(checks)) {
      if (!ok)
        throw new Error(
          `[content] "${code}" ${part} don't match the English ones (slugs/order).`,
        )
    }
  }
}
