import Link from "next/link"
import { getShopifyCart } from "@/lib/shopify/cart"
import ShopifyCartControls from "./ShopifyCartControls"
import StoreNotice from "./StoreNotice"

export default async function ShopifyCartPage() {
  let cart
  try { cart = await getShopifyCart() } catch { return <StoreNotice unavailable /> }
  return <div className="space-y-8">
    <Link href="/products" className="text-sm text-muted-foreground">← 商品一覧へ戻る</Link>
    <h1 className="text-4xl font-semibold">買い物かご</h1>
    {!cart || cart.totalQuantity === 0 ? <p>カートの中は空です。お気に入りの商品を見つけて追加しましょう。</p>
      : cart.lines.pageInfo.hasNextPage ? <StoreNotice unavailable />
      : <ShopifyCartControls lines={cart.lines.nodes} subtotal={cart.cost.subtotalAmount} />}
  </div>
}
