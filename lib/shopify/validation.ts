export function cartQuantity(value: unknown) {
  const number = typeof value === "string" && /^\d+$/.test(value) ? Number(value) : NaN
  if (!Number.isSafeInteger(number) || number < 1 || number > 99) throw new Error("数量は1〜99の整数で指定してください。")
  return number
}
export function variantId(value: unknown) {
  if (typeof value !== "string" || !/^gid:\/\/shopify\/ProductVariant\/\d+$/.test(value)) throw new Error("商品を選択してください。")
  return value
}
export function checkoutAddress(value: string, domain: string) {
  const url = new URL(value)
  if (url.protocol !== "https:" || url.username || url.password || url.port || ![domain, "checkout.shopify.com"].includes(url.hostname)) throw new Error("Invalid checkout URL")
  return url.href
}
