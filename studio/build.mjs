// Builds the studio into the site's static output as /admin. On Vercel, `nuxt generate`
// writes to .vercel/output/static (the Build Output API) instead of .output/public, so
// build next to whichever the site build produced.
import { existsSync } from "node:fs"
import { spawnSync } from "node:child_process"

const out = existsSync("../.vercel/output/static/index.html")
  ? "../.vercel/output/static/admin"
  : "../.output/public/admin"
console.log(`Building the admin area into ${out}`)
const { status } = spawnSync("npx", ["sanity", "build", out, "--yes"], {
  stdio: "inherit",
})
process.exit(status ?? 1)
