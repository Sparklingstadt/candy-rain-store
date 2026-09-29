"use client"
import Image from "next/image"
import Link from "next/link"
import { useActionState, useState } from "react"
import { addShopifyItem } from "@/app/actions/shopifyActions"
import { money, type ShopifyProduct } from "@/lib/shopify/types"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ShopifyProductActions({ product }: { product: ShopifyProduct }) {
  const [id, setId] = useState(product.variants.nodes.find(v => v.availableForSale)?.id ?? product.variants.nodes[0]?.id)
  const [state, action, pending] = useActionState(addShopifyItem, null)
  const variant = product.variants.nodes.find(v => v.id === id)
  const image = variant?.image ?? product.featuredImage
  return <div className="grid gap-10 lg:grid-cols-[1.2fr_.8fr]">
    <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted">
      {image ? <Image src={image.url} alt={image.altText || product.title} fill sizes="(max-width: 1024px) 100vw, 60vw" className="object-contain" priority /> : <span className="flex h-full items-center justify-center text-muted-foreground">画像準備中</span>}
    </div>
    <div className="space-y-6">
      <h1 className="text-4xl font-semibold tracking-tight">{product.title}</h1>
      <p className="text-2xl font-semibold text-primary">{money(variant?.price ?? product.priceRange.minVariantPrice)}</p>
      <p className="whitespace-pre-line leading-7 text-muted-foreground">{product.description}</p>
      <form action={action} className="space-y-4">
        <Label htmlFor="shopify-variant">バリエーション</Label>
        <select id="shopify-variant" name="variantId" value={id || ""} onChange={event => setId(event.target.value)} disabled={pending || !variant} className="w-full rounded-lg border bg-background p-3">
          {product.variants.nodes.map(v => <option key={v.id} value={v.id} disabled={!v.availableForSale}>{v.title === "Default Title" ? product.title : v.title}{!v.availableForSale ? "（売り切れ）" : ""}</option>)}
        </select>
        <Label htmlFor="shopify-quantity">数量</Label>
        <Input id="shopify-quantity" name="quantity" type="number" min="1" max="99" step="1" defaultValue="1" required disabled={pending || !variant?.availableForSale} />
        <Button type="submit" className="w-full" size="lg" disabled={pending || !variant?.availableForSale}>{pending ? "追加中…" : variant?.availableForSale ? "カートに追加" : "売り切れ"}</Button>
        {state && <p role={state.success ? "status" : "alert"}>{state.message}</p>}
      </form>
      <Link href="/cart" className={buttonVariants({ variant: "outline" })}>カートを見る</Link>
    </div>
  </div>
}
