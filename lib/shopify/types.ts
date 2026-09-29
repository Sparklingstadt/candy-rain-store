export type Money = { amount: string; currencyCode: string }
export type ProductImage = { url: string; altText: string | null }
export type ShopifyVariant = {
  id: string; title: string; availableForSale: boolean; price: Money; image: ProductImage | null
}
export type ShopifyProduct = {
  id: string; handle: string; title: string; description: string; productType: string
  availableForSale: boolean; featuredImage: ProductImage | null
  priceRange: { minVariantPrice: Money }
  variants: { nodes: ShopifyVariant[]; pageInfo: { hasNextPage: boolean; endCursor: string | null } }
}
export type ShopifyCart = {
  id: string; checkoutUrl: string; totalQuantity: number
  cost: { subtotalAmount: Money; totalAmount: Money }
  lines: { nodes: {
    id: string; quantity: number; cost: { totalAmount: Money }
    merchandise: ShopifyVariant & { product: { title: string; handle: string } }
  }[]; pageInfo: { hasNextPage: boolean } }
}
export function money(value: Money) {
  return new Intl.NumberFormat("ja-JP", { style: "currency", currency: value.currencyCode }).format(Number(value.amount))
}
