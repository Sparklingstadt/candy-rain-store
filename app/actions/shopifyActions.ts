"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { getShopifyCart, saveShopifyCart } from "@/lib/shopify/cart"
import { storefront, ShopifyError } from "@/lib/shopify/client"
import { shopifyDomain } from "@/lib/shopify/config"
import { CART_ADD, CART_CREATE, CART_REMOVE, CART_UPDATE } from "@/lib/shopify/operations"
import { cartQuantity, checkoutAddress, variantId } from "@/lib/shopify/validation"
import type { ShopifyCart } from "@/lib/shopify/types"

type State = { success: boolean; message: string } | null
type Payload = { cart: ShopifyCart | null; userErrors: { message: string }[]; warnings: { code: string; message: string }[] }

async function mutate(query: string, variables: Record<string, unknown>, field: string) {
  const data = await storefront<Record<string, Payload>>(query, variables)
  const payload = data[field]
  if (!payload || payload.userErrors.length || !payload.cart) throw new Error("カートを更新できませんでした。商品の販売状況と数量を確認してください。")
  await saveShopifyCart(payload.cart.id)
  revalidatePath("/", "layout")
  return {
    success: true,
    message: payload.warnings.length ? "在庫・販売状況に合わせてカートが調整されました。内容を確認してください。" : "カートを更新しました。",
  }
}

export async function addShopifyItem(_state: State, form: FormData): Promise<State> {
  try {
    const merchandiseId = variantId(form.get("variantId"))
    const quantity = cartQuantity(form.get("quantity"))
    const cart = await getShopifyCart()
    if (cart) {
      if (cart.lines.pageInfo.hasNextPage || cart.lines.nodes.length >= 250) throw new Error("カートの商品数が上限に達しています。")
      const existing = cart.lines.nodes.find(line => line.merchandise.id === merchandiseId)
      if (existing && existing.quantity + quantity > 99) throw new Error("同じ商品の数量は99個までです。")
      return await mutate(CART_ADD, { cartId: cart.id, lines: [{ merchandiseId, quantity }] }, "cartLinesAdd")
    }
    return await mutate(CART_CREATE, { input: { lines: [{ merchandiseId, quantity }] } }, "cartCreate")
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : new ShopifyError().message }
  }
}

export async function changeShopifyItem(_state: State, form: FormData): Promise<State> {
  try {
    const cart = await getShopifyCart()
    const lineId = form.get("lineId")
    if (!cart || !cart.lines.nodes.some(line => line.id === lineId)) throw new Error("カートの商品が見つかりません。画面を更新してください。")
    if (form.get("operation") === "remove") return await mutate(CART_REMOVE, { cartId: cart.id, lineIds: [lineId] }, "cartLinesRemove")
    const quantity = cartQuantity(form.get("quantity"))
    return await mutate(CART_UPDATE, { cartId: cart.id, lines: [{ id: lineId, quantity }] }, "cartLinesUpdate")
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : new ShopifyError().message }
  }
}

export async function checkoutShopify(): Promise<State> {
  let url: string
  try {
    const cart = await getShopifyCart()
    if (!cart || cart.totalQuantity === 0) throw new Error("カートに商品を追加してください。")
    if (cart.lines.pageInfo.hasNextPage || cart.lines.nodes.some(line => !line.merchandise.availableForSale)) throw new Error("購入できない商品があります。カートを確認してください。")
    url = checkoutAddress(cart.checkoutUrl, shopifyDomain())
  } catch {
    return { success: false, message: "購入手続きへ進めませんでした。カートの内容を確認し、再度お試しください。" }
  }
  redirect(url)
}
