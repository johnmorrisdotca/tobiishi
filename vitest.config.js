// Vitest runs the family's shared tests (the family's files and its thumbnails) and the README's; the package's own tests use node:test and Playwright.
import { defineConfig } from "vitest/config";
export default defineConfig({
  test: {
    include: [
      "test/family.test.js",
      "test/family-thumbnail.test.js",
      "test/readme.test.js",
      "src/docs-site.test.js",
      "src/readme.test.js",
      "src/embed-attributes.test.ts",
    ],
  },
});
