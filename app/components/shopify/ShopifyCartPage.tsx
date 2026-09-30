import Link from "next/link"
import { ArrowRight, ChevronLeft, ShoppingBag } from "lucide-react"
import { getShopifyCart } from "@/lib/shopify/cart"
import { buttonVariants } from "@/components/ui/button"
import EmptyState from "@/app/components/EmptyState"
import PageHeader from "@/app/components/PageHeader"
import ShopifyCartControls from "./ShopifyCartControls"
import StoreNotice from "./StoreNotice"

export default async function ShopifyCartPage() {
  let cart
  try { cart = await getShopifyCart() } catch { return <StoreNotice unavailable /> }
  const empty = !cart || cart.totalQuantity === 0
  return <div className="space-y-8">
    <Link href="/products" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><ChevronLeft className="size-4" /> 商品一覧へ戻る</Link>
    <PageHeader eyebrow="Your cart" title="買い物かご" tone="mint" description={empty ? undefined : `${cart!.totalQuantity}点の商品が入っています。`} />
    {empty ? <EmptyState icon={<ShoppingBag />} title="カートの中は空です" description="お気に入りの商品を見つけて、カートに追加しましょう。">
        <Link href="/products" className={buttonVariants({ size: "lg", className: "h-11 px-5" })}>商品を見る <ArrowRight /></Link>
        <Link href="/" className={buttonVariants({ variant: "outline", size: "lg", className: "h-11 bg-card px-5" })}>ホームへ戻る</Link>
      </EmptyState>
      : cart!.lines.pageInfo.hasNextPage ? <StoreNotice unavailable />
      : <ShopifyCartControls lines={cart!.lines.nodes} subtotal={cart!.cost.subtotalAmount} />}
  </div>
}
