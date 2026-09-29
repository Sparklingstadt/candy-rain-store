import { isShopifyEnabled } from "@/lib/shopify/config"
import ShopifyCatalog from "@/app/components/shopify/ShopifyCatalog"
import { getProductsWithVariants } from "@/services/storeQueryService"
import ProductList from "./ProductList"
import { Suspense } from "react"
import { ProductRepository } from "@/repositories/implementations/productRepository"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

export default async function Page({ searchParams }: { searchParams: Promise<{ after?: string }> }){
  const shopify = isShopifyEnabled()
  const { after } = await searchParams
  const repo = new ProductRepository()
  const products = shopify ? null : getProductsWithVariants(repo)

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <Badge variant="secondary">Collection</Badge>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Products</h1>
        <p className="max-w-2xl text-muted-foreground">毎日に小さな彩りを添える、Candy Rain Storeのオリジナルグッズ。</p>
      </div>
      <Suspense fallback={<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{[1,2,3].map(i => <Skeleton key={i} className="aspect-[4/3] rounded-2xl" />)}</div>}>
        {shopify ? <ShopifyCatalog after={after} /> : <ProductList productsPromise={products!} />}
      </Suspense>
    </div>
  )
}
