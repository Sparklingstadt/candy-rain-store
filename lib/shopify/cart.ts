import "server-only"
import { cookies } from "next/headers"
import { storefront } from "./client"
import { CART } from "./operations"
import type { ShopifyCart } from "./types"

export const CART_COOKIE = "candy_rain_shopify_cart"
export async function getShopifyCart() {
  const id = (await cookies()).get(CART_COOKIE)?.value
  if (!id) return null
  const { cart } = await storefront<{ cart: ShopifyCart | null }>(CART, { id })
  return cart
}
export async function saveShopifyCart(id: string) {
  ;(await cookies()).set(CART_COOKIE, id, {
    httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 10,
  })
}
