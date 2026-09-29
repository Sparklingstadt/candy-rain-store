import { isShopifyEnabled } from "@/lib/shopify/config"
import ShopifyAccount from "@/app/components/shopify/ShopifyAccount"
import { requireUserId } from "@/lib/auth"
import { getOrders } from "@/services/storeQueryService"
import { OrderRepository } from "@/repositories/implementations/orderRepository"
import { Badge } from "@/components/ui/badge"
import OrderHistory from "@/app/components/OrderHistory"

export default async function Page() {
  if (isShopifyEnabled()) return <ShopifyAccount />
  const userId = await requireUserId()
  const repo = new OrderRepository()
  const orders = await getOrders(repo, userId)

  return (
    <div className="space-y-8">
      <div className="space-y-3"><Badge variant="secondary">Order history</Badge><h1 className="text-4xl font-semibold tracking-tight">注文履歴</h1><p className="text-muted-foreground">これまでの注文内容と配送状況を確認できます。</p></div>
      <OrderHistory orders={orders} />
    </div>
  )
}
