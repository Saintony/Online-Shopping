// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["@pinia/nuxt", "@nuxtjs/tailwindcss"],
  typescript: { strict: true },
  css: ["primeicons/primeicons.css"],
  pinia: {
    autoImports: ["defineStore"],
  },
});
