// ESLint: Nuxt's recommended rules (Vue, TypeScript, auto-imports) from @nuxt/eslint, with
// anything that's Prettier's job switched off (eslint-config-prettier). `npm run lint`.
import prettier from "eslint-config-prettier"
import withNuxt from "./.nuxt/eslint.config.mjs"

export default withNuxt(
  {
    ignores: ["studio/**", "translations/**", ".vercel/**"],
  },
  {
    rules: {
      // Optional props typed with TypeScript are undefined when left out; that's intended.
      "vue/require-default-prop": "off",
    },
  },
  prettier,
)
