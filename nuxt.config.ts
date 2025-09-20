// nuxt.config.ts
export default defineNuxtConfig({
  modules: ["@pinia/nuxt", "@nuxtjs/tailwindcss"],

  // ให้ Tailwind module ใช้ไฟล์ของเราโดยตรง
  tailwindcss: {
    cssPath: "@/assets/css/main.css",
    viewer: true,
  },

  // global CSS อื่น ๆ ที่ต้องการ (เช่น primeicons)
  css: ["primeicons/primeicons.css"],

  // ย้าย postcss มาที่นี่ แล้วลบไฟล์ postcss.config.js
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  typescript: { strict: true },

  nitro: { compatibilityDate: "2025-09-20" },
});
