export function isShopifyEnabled() {
  return process.env.COMMERCE_PROVIDER === "shopify"
}

export function shopifyDomain() {
  const domain = process.env.SHOPIFY_STORE_DOMAIN?.trim()
  if (!domain || !/^[a-z0-9][a-z0-9-]*\.myshopify\.com$/.test(domain)) {
    throw new Error("SHOPIFY_STORE_DOMAIN must be a myshopify.com hostname")
  }
  return domain
}
