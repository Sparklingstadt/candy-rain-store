import { getProductImageUrl } from "@/lib/product-images"
import Link from "next/link"
import Image from "next/image"
import { Product, Variant } from "@/lib/types"
import { use } from "react"
import { ArrowUpRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

export default function ProductList({ productsPromise }: {
  productsPromise: Promise<(Product & { variants: Variant[] })[]>
}){
  const getProductStartingPrice = (productsWithVariants: (Product & { variants: Variant[] })) => {
    return Math.min(...productsWithVariants.variants.map(v => v.price))
  }

  const products = use(productsPromise)

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      { products.map(product => {
        const isSoldOut = product.variants.every(variant => variant.stock <= 0)
        return (
          <Link href={"/products/" + product.id} key={product.id} className="group">
            <Card className="h-full overflow-hidden p-0 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10">
              <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                <Image src={getProductImageUrl(product)} alt={product.name} fill className="object-contain transition duration-500 group-hover:scale-105" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
                <Badge className="absolute left-4 top-4" variant="secondary">{product.category || "グッズ"}</Badge>
                {isSoldOut ? <Badge className="absolute right-4 top-4" variant="destructive">売り切れ</Badge> : null}
              </div>
              <CardContent className="flex items-end justify-between p-5">
                <div>
                  <h2 className="text-lg font-medium">{product.name}</h2>
                  <p className="mt-2 font-semibold text-primary">¥{getProductStartingPrice(product).toLocaleString()}〜</p>
                </div>
                <span className="flex size-9 items-center justify-center rounded-full border transition group-hover:bg-primary group-hover:text-primary-foreground"><ArrowUpRight className="size-4" /></span>
              </CardContent>
            </Card>
          </Link>
        )
      })}
    </div>
  )
}
