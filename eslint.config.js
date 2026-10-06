import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist/", "site/", "node_modules/", "test-results/", "playwright-report/"] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  { files: ["test/**/*.mjs", "playwright.config.mjs"], languageOptions: { globals: { console: "readonly", URL: "readonly", document: "readonly", window: "readonly", location: "readonly", localStorage: "readonly", innerWidth: "readonly", process: "readonly" } } },
  { files: ["scripts/**/*.mjs"], languageOptions: { globals: { console: "readonly", URL: "readonly", document: "readonly", process: "readonly" } } },
  { files: ["scripts/readme-pictures.mjs"], languageOptions: { globals: { window: "readonly", localStorage: "readonly" } } },
  { files: ["demo/**/*.js"], languageOptions: { globals: { document: "readonly", window: "readonly", location: "readonly", history: "readonly", navigator: "readonly", Worker: "readonly", URL: "readonly", URLSearchParams: "readonly", Intl: "readonly", setInterval: "readonly", setTimeout: "readonly", localStorage: "readonly", familyLanguage: "readonly", familyHelp: "readonly", CustomEvent: "readonly" } } },
  { rules: { "@typescript-eslint/no-non-null-assertion": "off" } },
);
