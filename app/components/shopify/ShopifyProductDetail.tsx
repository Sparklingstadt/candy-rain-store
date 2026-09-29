import Link from "next/link"
import { notFound } from "next/navigation"
import { getShopifyProduct } from "@/lib/shopify/catalog"
import ShopifyProductActions from "./ShopifyProductActions"
import StoreNotice from "./StoreNotice"

export default async function ShopifyProductDetail({ handle }: { handle: string }) {
  let product
  try { product = await getShopifyProduct(handle) } catch { return <StoreNotice unavailable /> }
  if (!product) notFound()
  return <div className="space-y-8"><Link href="/products" className="text-sm text-muted-foreground">← 商品一覧へ戻る</Link><ShopifyProductActions product={product} /></div>
}
