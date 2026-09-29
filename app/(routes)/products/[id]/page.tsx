import { isShopifyEnabled } from "@/lib/shopify/config"
import ShopifyProductDetail from "@/app/components/shopify/ShopifyProductDetail"
import { getProductById, getVariantsByProductId } from "@/services/storeQueryService"
import ProductImageView from "./ProductImageView"
import { ProductActions } from "./ProductActions"
import { requireUserId } from "@/lib/auth"
import { ProductRepository } from "@/repositories/implementations/productRepository"
import { variantRepository } from "@/repositories/implementations/variantRepository"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { toNonNegativeInteger } from "@/lib/validation"
import { notFound } from "next/navigation"

export default async function Page({ params }: { 
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  if (isShopifyEnabled()) {
    let handle: string
    try { handle = decodeURIComponent(id) } catch { notFound() }
    return <ShopifyProductDetail handle={handle} />
  }
  const productId = toNonNegativeInteger(id)
  if (productId === null) notFound()
  await requireUserId()
  const repo = new ProductRepository()
  const product = await getProductById(repo, productId)
  if(!product) notFound()
  const variantRepo = new variantRepository()
  const variants = await getVariantsByProductId(variantRepo, product.id)
  const minPrice = Math.min(...variants.map(v => v.price))
  return (
    <div className="space-y-8">
      <Link href="/products" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><ChevronLeft className="size-4" /> 商品一覧へ戻る</Link>
      <div className="grid gap-10 lg:grid-cols-[1.2fr_.8fr] lg:gap-16">
        <ProductImageView product={product} variants={variants} />
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="space-y-5">
            <Badge variant="secondary">{product.category || "カテゴリー指定なし"}</Badge>
            <h1 className="text-4xl font-semibold tracking-tight">{product.name}</h1>
            <p className="text-2xl font-semibold text-primary">¥{minPrice.toLocaleString()}〜</p>
            <p className="leading-7 text-muted-foreground">{product.description || "日常にさりげない彩りを添える、Candy Rain Storeのオリジナルアイテムです。"}</p>
          </div>
          <Separator className="my-7" />
          <ProductActions variants={variants} />
        </div>
      </div>
    </div>
  )
}
