// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  // Your custom configs here
).override(
  "nuxt/typescript/rules", {
    rules: {
      "@typescript-eslint/no-unused-vars": "warn",
    },
  }
)
