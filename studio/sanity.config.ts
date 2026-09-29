import { defineConfig } from "sanity"
import { structureTool } from "sanity/structure"
import { googleRating } from "./schemas/googleRating"
import { job } from "./schemas/job"
import { review } from "./schemas/review"

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
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            S.documentTypeListItem("job").title("Recent work"),
            S.documentTypeListItem("review").title("Reviews"),
            // One Google rating document, opened directly.
            S.listItem()
              .title("Google rating")
              .id("googleRating")
              .child(
                S.document()
                  .schemaType("googleRating")
                  .documentId("googleRating"),
              ),
          ]),
    }),
  ],
  schema: {
    types: [job, review, googleRating],
    // Only one Google rating: no "create new" for it.
    templates: (templates) =>
      templates.filter((t) => t.schemaType !== "googleRating"),
  },
  document: {
    actions: (actions, { schemaType }) =>
      schemaType === "googleRating"
        ? actions.filter(
            ({ action }) => action !== "duplicate" && action !== "delete",
          )
        : actions,
  },
})
