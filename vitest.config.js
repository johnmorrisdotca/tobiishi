// Vitest runs the family's shared test and the README's; the package's own tests use node:test and Playwright.
import { defineConfig } from "vitest/config";
export default defineConfig({ test: { include: ["test/family.test.js", "test/readme.test.js"] } });
