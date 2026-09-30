import { join } from "node:path"
import dayjs from "dayjs"
import timezone from "dayjs/plugin/timezone"
import utc from "dayjs/plugin/utc"
import { addTypeTemplate, addVitePlugin, defineNuxtModule } from "nuxt/kit"
import * as z from "zod"
import {
  openingHoursInputSchema,
  toOpeningHours,
  type Closure,
} from "../app/data/hours-schema"
import { fetchSanityContent } from "./lib/sanity"

dayjs.extend(utc)
dayjs.extend(timezone)

// Loads opening hours and holiday closures from Sanity (the admin area at /admin) at build
// time and serves them as `virtual:chs-hours`. Unset or invalid: the site uses app.config
// `openingHours` and shows no closures. Closures that have ended are dropped (at the next
// rebuild; the live open/closed line checks the date itself).
export default defineNuxtModule({
  meta: { name: "hours" },
  async setup(_, nuxt) {
    const drafts =
      nuxt.options.dev || process.env.NUXT_PUBLIC_SHOW_DRAFTS === "true"
    const content = await fetchSanityContent(drafts)
    const today = dayjs().tz("Europe/London").format("YYYY-MM-DD")

    let openingHours: string[] | null = null
    let closures: Closure[] = []
    // The hours shown are unpublished changes: only in dev and the preview build.
    let draft = false
    if (content.openingHours) {
      const parsed = openingHoursInputSchema.safeParse(content.openingHours)
      if (parsed.success) {
        openingHours = toOpeningHours(parsed.data)
        draft = parsed.data.draft
        closures = parsed.data.closures
          .filter((c) => c.to >= today)
          .sort((a, b) => a.from.localeCompare(b.from))
      } else
        console.warn(
          `[hours] Using app.config openingHours: the admin area's opening hours are invalid: ${z.prettifyError(parsed.error)}`,
        )
    }

    // No "#" in the id: in dev it becomes part of a URL, where "#" starts the fragment.
    const id = "virtual:chs-hours"
    addVitePlugin({
      name: "chs-hours",
      resolveId: (source) => (source === id ? `\0${id}` : undefined),
      load: (resolved) =>
        resolved === `\0${id}`
          ? `export const openingHours = ${JSON.stringify(openingHours)}\nexport const closures = ${JSON.stringify(closures)}\nexport const draft = ${draft}`
          : undefined,
    })
    addTypeTemplate({
      filename: "types/hours.d.ts",
      getContents: () =>
        `declare module "virtual:chs-hours" {\n  export const openingHours: string[] | null\n  export const closures: import("${join(nuxt.options.rootDir, "app/data/hours-schema")}").Closure[]\n  export const draft: boolean\n}\n`,
    })
  },
})
