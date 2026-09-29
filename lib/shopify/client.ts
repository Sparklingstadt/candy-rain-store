import "server-only"
import { headers } from "next/headers"
import { isShopifyEnabled, shopifyDomain } from "./config"

export class ShopifyError extends Error {
  constructor() { super("ストアに接続できませんでした。しばらくしてから再度お試しください。") }
}

export async function storefront<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  if (!isShopifyEnabled()) throw new ShopifyError()
  const requestHeaders: Record<string, string> = { "Content-Type": "application/json" }
  const token = process.env.SHOPIFY_STOREFRONT_PRIVATE_TOKEN
  if (token) {
    requestHeaders["Shopify-Storefront-Private-Token"] = token
    // Vercel overwrites this header. Never trust a caller-supplied forwarding header on other hosts.
    if (process.env.VERCEL === "1") {
      const ip = (await headers()).get("x-vercel-forwarded-for")?.split(",")[0]?.trim()
      if (ip) requestHeaders["Shopify-Storefront-Buyer-IP"] = ip
    }
  }
  try {
    const response = await fetch(`https://${shopifyDomain()}/api/2026-07/graphql.json`, {
      method: "POST", headers: requestHeaders, body: JSON.stringify({ query, variables }),
      cache: "no-store", signal: AbortSignal.timeout(15_000),
    })
    if (!response.ok) throw new ShopifyError()
    const result = await response.json() as { data?: T; errors?: unknown[] }
    if (result.errors?.length || !result.data) throw new ShopifyError()
    return result.data
  } catch {
    // Do not expose upstream responses: they can contain cart secrets or credentials.
    throw new ShopifyError()
  }
}
