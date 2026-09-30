import { getProductImageUrl } from "@/lib/product-images"
import { money, type ShopifyProduct } from "@/lib/shopify/types"
import type { Product, Variant } from "@/lib/types"

// Display-only shape shared by the demo and Shopify catalogs.
export type ProductSummary = {
  key: string
  href: string
  name: string
  category: string
  price: string
  image: { src: string; alt: string } | null
  soldOut: boolean
}

export function fromShopifyProduct(product: ShopifyProduct): ProductSummary {
  return {
    key: product.id,
    href: `/products/${encodeURIComponent(product.handle)}`,
    name: product.title,
    category: product.productType || "グッズ",
    price: `${money(product.priceRange.minVariantPrice)}〜`,
    image: product.featuredImage ? { src: product.featuredImage.url, alt: product.featuredImage.altText || product.title } : null,
    soldOut: !product.availableForSale,
  }
}

export function fromDemoProduct(product: Product & { variants: Variant[] }): ProductSummary {
  return {
    key: String(product.id),
    href: `/products/${product.id}`,
    name: product.name,
    category: product.category || "グッズ",
    price: `¥${Math.min(...product.variants.map(v => v.price)).toLocaleString()}〜`,
    image: { src: getProductImageUrl(product), alt: product.name },
    soldOut: product.variants.every(variant => variant.stock <= 0),
  }
}
