import { Product, Variant } from "@/lib/types"
import { use } from "react"
import { candyToneAt } from "@/lib/candy"
import ProductCard from "@/app/components/ProductCard"
import { fromDemoProduct } from "@/app/components/productSummaries"

export default function ProductList({ productsPromise }: {
  productsPromise: Promise<(Product & { variants: Variant[] })[]>
}){
  const products = use(productsPromise)

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product, index) => {
        const summary = fromDemoProduct(product)
        return <ProductCard key={summary.key} product={summary} tone={candyToneAt(index)} />
      })}
    </div>
  )
}
