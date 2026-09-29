"use server"
import { requireUserId } from "@/lib/auth"
import { requireNonNegativeInteger } from "@/lib/validation"
import { removeItemFromCart } from "@/services/cartService"
import { revalidatePath } from "next/cache"

export async function removeCartItem({ variantId }: {
  variantId: number
}) {
  const userId = await requireUserId()
  const validatedVariantId = requireNonNegativeInteger(variantId, "variantId")
  await removeItemFromCart(userId, validatedVariantId)
  revalidatePath("/", "layout")
  return { success: true }
}
