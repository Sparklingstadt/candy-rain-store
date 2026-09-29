import { shopifyDomain } from "./config"

// Set this to the customer account URL shown in Shopify Settings > Customer accounts.
// Only Shopify-hosted account roots are accepted; never use request/query parameters.
export function customerAccountUrl(section: "orders" | "profile" | "addresses" = "orders") {
  const configured = process.env.SHOPIFY_CUSTOMER_ACCOUNT_URL?.trim()
  if (configured) {
    const url = new URL(configured)
    if (url.protocol !== "https:" || url.hostname !== "shopify.com" || url.port || url.username || url.password || url.search || url.hash || !/^\/\d+\/account\/?$/.test(url.pathname)) {
      throw new Error("SHOPIFY_CUSTOMER_ACCOUNT_URL must be a Shopify-hosted customer account URL")
    }
    url.pathname = url.pathname.replace(/\/$/, "") + (section === "orders" ? "" : "/profile")
    url.searchParams.set("locale", "ja")
    return url.href
  }
  // Shopify redirects these storefront routes to the configured customer accounts.
  return `https://${shopifyDomain()}/account${section === "addresses" ? "/addresses" : ""}`
}
