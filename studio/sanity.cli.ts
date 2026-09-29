import { existsSync } from "node:fs"
import { defineCliConfig } from "sanity/cli"

// Share the site's .env (SANITY_STUDIO_PROJECT_ID etc.) instead of keeping a second one here.
// Variables already set (e.g. in Vercel's build settings) win.
if (existsSync("../.env")) process.loadEnvFile("../.env")

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID,
    dataset: process.env.SANITY_STUDIO_DATASET || "production",
  },
  // Served from the site's /admin (asset URLs too), matching basePath in sanity.config.ts.
  project: { basePath: "/admin" },
})
