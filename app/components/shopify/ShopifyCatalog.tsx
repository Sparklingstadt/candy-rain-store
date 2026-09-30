import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { getShopifyProducts } from "@/lib/shopify/catalog"
import { candyToneAt } from "@/lib/candy"
import { buttonVariants } from "@/components/ui/button"
import ProductCard from "@/app/components/ProductCard"
import { fromShopifyProduct } from "@/app/components/productSummaries"
import StoreNotice from "./StoreNotice"

export default async function ShopifyCatalog({ after }: { after?: string }) {
  let products
  try { products = await getShopifyProducts(after) } catch { return <StoreNotice unavailable /> }
  if (!products.nodes.length) return <StoreNotice />
  const hasNext = products.pageInfo.hasNextPage && products.pageInfo.endCursor
  return <div className="space-y-10">
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {products.nodes.map((product, index) => <ProductCard key={product.id} product={fromShopifyProduct(product)} tone={candyToneAt(index)} />)}
    </div>
    {(after || hasNext) && <nav aria-label="ページ送り" className="flex flex-wrap items-center gap-3">
      {after && <Link href="/products" className={buttonVariants({ variant: "ghost" })}>最初のページへ</Link>}
      {hasNext && <Link href={`/products?after=${encodeURIComponent(products.pageInfo.endCursor!)}`} className={buttonVariants({ variant: "outline", size: "lg", className: "h-11 px-5" })}>次の商品を見る <ArrowRight /></Link>}
    </nav>}
  </div>
}
