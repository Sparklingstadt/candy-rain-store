import { defineConfig, devices } from "@playwright/test"
export default defineConfig({
  testDir: "./tests/shopify", testMatch: "*.spec.ts", workers: 1,
  use: { baseURL: "http://127.0.0.1:3107", trace: "retain-on-failure" },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: "node --import ./tests/shopify/mock-storefront.mjs node_modules/next/dist/bin/next start --hostname 127.0.0.1 --port 3107",
    url: "http://127.0.0.1:3107", timeout: 60_000, reuseExistingServer: false,
    env: { COMMERCE_PROVIDER: "shopify", SHOPIFY_STORE_DOMAIN: "candy-rain-test.myshopify.com", SHOPIFY_STOREFRONT_PRIVATE_TOKEN: "", AUTH_SECRET: "test-only-not-used-for-shopify", AUTH_TRUST_HOST: "true" },
  },
})
