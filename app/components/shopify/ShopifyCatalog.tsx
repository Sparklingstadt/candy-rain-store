import Image from "next/image"
import Link from "next/link"
import { getShopifyProducts } from "@/lib/shopify/catalog"
import { money } from "@/lib/shopify/types"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import StoreNotice from "./StoreNotice"

export default async function ShopifyCatalog({ after }: { after?: string }) {
  let products
  try { products = await getShopifyProducts(after) } catch { return <StoreNotice unavailable /> }
  if (!products.nodes.length) return <StoreNotice />
  return <div className="space-y-8">
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {products.nodes.map(product => <Link href={`/products/${encodeURIComponent(product.handle)}`} key={product.id} className="group">
        <Card className="h-full overflow-hidden p-0 transition hover:-translate-y-1 hover:shadow-xl">
          <div className="relative aspect-[4/3] bg-muted">
            {product.featuredImage ? <Image src={product.featuredImage.url} alt={product.featuredImage.altText || product.title} fill sizes="(max-width: 640px) 100vw, 33vw" className="object-cover" /> : <span className="flex h-full items-center justify-center text-muted-foreground">画像準備中</span>}
            <Badge className="absolute left-4 top-4" variant="secondary">{product.productType || "グッズ"}</Badge>
            {!product.availableForSale && <Badge className="absolute right-4 top-4" variant="destructive">売り切れ</Badge>}
          </div>
          <CardContent className="p-5"><h2 className="text-lg font-medium">{product.title}</h2><p className="mt-2 font-semibold text-primary">{money(product.priceRange.minVariantPrice)}〜</p></CardContent>
        </Card>
      </Link>)}
    </div>
    {products.pageInfo.hasNextPage && products.pageInfo.endCursor && <Link href={`/products?after=${encodeURIComponent(products.pageInfo.endCursor)}`} className={buttonVariants({ variant: "outline" })}>次の商品を見る</Link>}
    {after && <Link href="/products" className={buttonVariants({ variant: "ghost" })}>最初のページへ</Link>}
  </div>
}
