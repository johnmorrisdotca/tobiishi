// Vitest runs only the family's shared test; the package's own tests use node:test and Playwright.
import { defineConfig } from "vitest/config";
export default defineConfig({ test: { include: ["test/family.test.js"] } });
