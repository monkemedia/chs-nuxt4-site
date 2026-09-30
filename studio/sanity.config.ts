import { defineConfig } from "sanity"
import { structureTool } from "sanity/structure"
import { googleRating } from "./schemas/googleRating"
import { job } from "./schemas/job"
import { openingHours } from "./schemas/openingHours"
import { review } from "./schemas/review"
import { vacancy } from "./schemas/vacancy"

// Documents there's only ever one of, opened directly: no "create new", duplicate or delete.
const singletons = ["openingHours", "googleRating"]

// The CHS admin area: Sanity Studio, built into the site at /admin (see AGENTS.md "Admin").
// The /admin path is set once, in sanity.cli.ts: setting it here too doubles it (/admin/admin).
// Staff log in with the email or Google account they were invited with.
export default defineConfig({
  name: "chs",
  title: "CHS Hydraulics",
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || "missing-project-id",
  dataset: process.env.SANITY_STUDIO_DATASET || "production",
  plugins: [
    structureTool({
      structure: (S) => {
        const singleton = (id: string, title: string) =>
          S.listItem()
            .title(title)
            .id(id)
            .child(S.document().schemaType(id).documentId(id))
        return S.list()
          .title("Content")
          .items([
            S.documentTypeListItem("job").title("Recent work"),
            S.documentTypeListItem("review").title("Reviews"),
            S.documentTypeListItem("vacancy").title("Vacancies"),
            S.divider(),
            singleton("openingHours", "Opening hours"),
            singleton("googleRating", "Google rating"),
          ])
      },
    }),
  ],
  schema: {
    types: [job, review, googleRating, vacancy, openingHours],
    templates: (templates) =>
      templates.filter((t) => !singletons.includes(t.schemaType)),
  },
  document: {
    actions: (actions, { schemaType }) =>
      singletons.includes(schemaType)
        ? actions.filter(
            ({ action }) => action !== "duplicate" && action !== "delete",
          )
        : actions,
  },
})
