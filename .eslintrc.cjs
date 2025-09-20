// .eslintrc.cjs
module.exports = {
  root: true,
  env: { browser: true, node: true, es2021: true },
  parser: "vue-eslint-parser",
  parserOptions: {
    parser: "@typescript-eslint/parser",
    ecmaVersion: 2022,
    sourceType: "module",
    extraFileExtensions: [".vue"],
  },
  extends: [
    "eslint:recommended",
    "plugin:vue/vue3-recommended",
    "plugin:@typescript-eslint/recommended",
  ],
  plugins: ["vue", "@typescript-eslint", "import"],
  settings: {
    "import/resolver": { typescript: { project: "./tsconfig.json" } },
  },
  rules: { "vue/multi-word-component-names": "off" },
};
