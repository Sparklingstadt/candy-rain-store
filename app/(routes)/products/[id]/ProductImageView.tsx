import { getProductImageUrl, getVariantImageUrl } from "@/lib/product-images"
import { getProductById, getVariantsByProductId } from "@/services/storeQueryService"
import { ProductRepository } from "@/repositories/implementations/productRepository"
import { variantRepository } from "@/repositories/implementations/variantRepository"
import Image from "next/image"

export default async function ProductImageView({ productId }: { productId: number}) {
  const repo = new ProductRepository()
  const product = await getProductById(repo, productId)
  if(!product) throw new Error("Product not found")
  const variantRepo = new variantRepository()
  const variants = await getVariantsByProductId(variantRepo, productId)

  return (
    <div className="space-y-4">
      <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border bg-muted shadow-sm">
        <Image src={getProductImageUrl(product)} alt={product.name} fill className="object-contain" sizes="(max-width: 1024px) 100vw, 60vw" priority />
      </div>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
        { variants.map(v => (
          <div key={v.id} className="relative aspect-square overflow-hidden rounded-xl border bg-muted">
            <Image src={getVariantImageUrl(v)} alt={v.name} fill className="object-contain" sizes="160px" />
          </div>
        ))}          
      </div>
    </div>
  )
}
