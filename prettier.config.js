/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions} */
const config = {
  plugins: ["prettier-plugin-tailwindcss"],
  arrowParens: "always",
  bracketSpacing: true,
  endOfLine: "auto",
  printWidth: 80,
  quoteProps: "as-needed",
  trailingComma: "none",
  useTabs: false,
  tabWidth: 2,
  semi: true,
  singleQuote: true,
};

export default config;
