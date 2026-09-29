import { defineCliConfig } from "sanity/cli"

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID,
    dataset: process.env.SANITY_STUDIO_DATASET || "production",
  },
  // Served from the site's /admin (asset URLs too), matching basePath in sanity.config.ts.
  project: { basePath: "/admin" },
})
