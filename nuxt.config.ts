// nuxt.config.ts
export default defineNuxtConfig({
  modules: ["@pinia/nuxt", "@nuxtjs/tailwindcss"],

  tailwindcss: { cssPath: "@/assets/css/main.css", viewer: true },

  // css: [
  //   "primevue/resources/themes/aura-light-amber/theme.css",
  //   "primeicons/primeicons.css",
  //   "@/assets/css/main.css",
  // ],
  css: [
    "primevue/resources/themes/saga-blue/theme.css",
    "primevue/resources/primevue.min.css",
    "primeicons/primeicons.css",
  ],
  postcss: { plugins: { tailwindcss: {}, autoprefixer: {} } },
  typescript: { strict: true },
  nitro: { compatibilityDate: "2025-09-20" },
});
