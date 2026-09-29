"use client"
import Link from "next/link"
import { useActionState } from "react"
import { changeShopifyItem, checkoutShopify } from "@/app/actions/shopifyActions"
import { money, type ShopifyCart } from "@/lib/shopify/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"

// Cart ID and checkout URL are deliberately excluded from the browser payload.
export default function ShopifyCartControls({ lines, subtotal }: { lines: ShopifyCart["lines"]["nodes"]; subtotal: ShopifyCart["cost"]["subtotalAmount"] }) {
  const [state, action, pending] = useActionState(changeShopifyItem, null)
  const [checkoutState, checkoutAction, checkingOut] = useActionState(checkoutShopify, null)
  const busy = pending || checkingOut
  return <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
    <div className="space-y-4">
      {lines.map(line => <Card key={line.id}><CardContent className="space-y-4">
        <Link href={`/products/${encodeURIComponent(line.merchandise.product.handle)}`} className="font-semibold">{line.merchandise.product.title}</Link>
        <p>{line.merchandise.title === "Default Title" ? "" : line.merchandise.title}</p>
        <p>{money(line.merchandise.price)} / 個 · 合計 {money(line.cost.totalAmount)}</p>
        {!line.merchandise.availableForSale && <p role="alert">この商品は現在購入できません。カートから削除してください。</p>}
        <form action={action} className="flex flex-wrap items-end gap-3">
          <input type="hidden" name="lineId" value={line.id} />
          <label className="space-y-2 text-sm">数量<Input key={line.quantity} name="quantity" type="number" min="1" max="99" step="1" defaultValue={line.quantity} required className="w-24" disabled={busy} /></label>
          <Button type="submit" name="operation" value="update" disabled={busy} variant="outline">更新</Button>
          <Button type="submit" name="operation" value="remove" disabled={busy} formNoValidate variant="ghost">削除</Button>
        </form>
      </CardContent></Card>)}
      {state && <p role={state.success ? "status" : "alert"}>{state.message}</p>}
    </div>
    <Card className="h-fit"><CardContent className="space-y-5">
      <h2 className="text-xl font-semibold">ご注文内容</h2>
      <div className="flex justify-between"><span>小計</span><span className="font-semibold">{money(subtotal)}</span></div>
      <p className="text-sm text-muted-foreground">送料・税金・割引を含む最終金額は購入手続きで確認できます。</p>
      <form action={checkoutAction}><Button type="submit" className="w-full" disabled={busy || lines.some(line => !line.merchandise.availableForSale)}>{checkingOut ? "接続中…" : "購入手続きへ"}</Button></form>
      {checkoutState && <p role="alert">{checkoutState.message}</p>}
    </CardContent></Card>
  </div>
}
