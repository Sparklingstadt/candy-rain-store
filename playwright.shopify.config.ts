import { defineConfig, devices } from "@playwright/test"
const port = process.env.SHOPIFY_E2E_PORT || "3107"
const baseURL = `http://127.0.0.1:${port}`
export default defineConfig({
  testDir: "./tests/shopify", testMatch: "*.spec.ts", workers: 1,
  use: { baseURL, trace: "retain-on-failure" },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: `node --import ./tests/shopify/mock-storefront.mjs node_modules/next/dist/bin/next start --hostname 127.0.0.1 --port ${port}`,
    url: baseURL, timeout: 60_000, reuseExistingServer: false,
    env: { COMMERCE_PROVIDER: "shopify", SHOPIFY_STORE_DOMAIN: "candy-rain-test.myshopify.com", SHOPIFY_STOREFRONT_PRIVATE_TOKEN: "", AUTH_SECRET: "test-only-not-used-for-shopify", AUTH_TRUST_HOST: "true" },
  },
})
