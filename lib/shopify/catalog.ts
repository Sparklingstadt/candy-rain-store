import "server-only"
import { storefront } from "./client"
import { PRODUCT, PRODUCTS } from "./operations"
import type { ShopifyProduct } from "./types"

export async function getShopifyProducts(after?: string) {
  const data = await storefront<{ products: { nodes: ShopifyProduct[]; pageInfo: { hasNextPage: boolean; endCursor: string | null } } }>(PRODUCTS, { after: after || null })
  return data.products
}

export async function getShopifyProduct(handle: string) {
  let after: string | null = null
  let product: ShopifyProduct | null = null
  do {
    const data: { product: ShopifyProduct | null } = await storefront(PRODUCT, { handle, after })
    if (!data.product) return null
    if (!product) product = data.product
    else product.variants.nodes.push(...data.product.variants.nodes)
    after = data.product.variants.pageInfo.hasNextPage ? data.product.variants.pageInfo.endCursor : null
  } while (after)
  return product
}
