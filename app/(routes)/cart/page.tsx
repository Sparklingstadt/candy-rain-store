import { isShopifyEnabled } from "@/lib/shopify/config"
import ShopifyCartPage from "@/app/components/shopify/ShopifyCartPage"
import Link from "next/link"
import CartItemTable from "./CartItemTable"
import PlaceOrderButton from "./PlaceOrderButton"
import { requireUserId } from "@/lib/auth"
import { getCartByUserId, getCartItemsWithVariantsByCartId } from "@/services/storeQueryService"
import { CartSummary } from "./CartSummary"
import { cartItemRepository } from "@/repositories/implementations/cartItemRepository"
import { cartRepository } from "@/repositories/implementations/cartRepository"
import { ChevronLeft, ShoppingBag } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default async function Page(){
  if (isShopifyEnabled()) return <ShopifyCartPage />
  const userId = await requireUserId()
  const cartRepo = new cartRepository()
  const cart = await getCartByUserId(cartRepo, userId)
  if(!cart) throw new Error("Cart not found")
  const repo = new cartItemRepository()
  const cartItems = await getCartItemsWithVariantsByCartId(repo, cart.id)
  const subTotalPrice = cartItems.reduce((acc, item) => acc + (item.quantity * item.variant.price), 0)
  const totalPrice = subTotalPrice + 1000

  return (
    <div className="space-y-8">
      <Link href="/products" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><ChevronLeft className="size-4" /> 商品一覧へ戻る</Link>
      <div className="space-y-3">
        <Badge variant="secondary"><ShoppingBag /> Your cart</Badge>
        <h1 className="text-4xl font-semibold tracking-tight">買い物かご</h1>
        <p className="text-muted-foreground">{cartItems.length}種類の商品が入っています。</p>
      </div>
      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <CartItemTable cartItems={cartItems} />
        <div className="space-y-4">
          <CartSummary cartItems={cartItems} subTotalPrice={subTotalPrice} shippingFee={1000} totalPrice={totalPrice} />
          {cartItems.length > 0 && <PlaceOrderButton />}
        </div>
      </div>
    </div>
  )
}
