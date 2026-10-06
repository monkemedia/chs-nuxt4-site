import { fileURLToPath } from "node:url"
import { defineConfig } from "vitest/config"

// Unit tests (`npm test`): plain functions in shared/ and the site content, run in Node without
// starting Nuxt. Same path aliases as the app.
export default defineConfig({
  resolve: {
    alias: {
      "~": fileURLToPath(new URL("./app", import.meta.url)),
      "#shared": fileURLToPath(new URL("./shared", import.meta.url)),
    },
  },
  test: {
    include: ["tests/**/*.test.ts"],
    environment: "node",
  },
})
