import { cy } from "./cy"
import { en } from "./en"

export type { Content } from "./en"

export const contentByLocale = { en, cy }
export type LocaleCode = keyof typeof contentByLocale

// Every locale must list the same services, sectors and benefits in the same order
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
    }
    for (const [part, ok] of Object.entries(checks)) {
      if (!ok)
        throw new Error(
          `[content] "${code}" ${part} don't match the English ones (slugs/order).`,
        )
    }
  }
}
