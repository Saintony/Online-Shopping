// tailwind.config.js
export default {
  content: [
    "./components/**/*.{vue,js,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#FF5F1F",
          primaryDark: "#FFAC1C",
          dark: "#111827",
          muted: "#F6F7F9",
          darkGray: "#E5E4E2",
        },
      },
      boxShadow: {
        card: "0 1px 2px rgba(16,24,40,.06), 0 1px 3px rgba(16,24,40,.10)",
      },
      borderRadius: {
        xl: "12px",
      },
    },
  },
  plugins: [],
};
