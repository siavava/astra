// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@nuxt/content', "@nuxt/eslint"],

  // load styles/defaults.scss
  css: [
    "@/styles/defaults.sass"
  ]
})
