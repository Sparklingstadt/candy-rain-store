import { getProductImageUrl, getVariantImageUrl } from "@/lib/product-images"
import ProductImageGallery from "@/app/components/ProductImageGallery"

type Product = Parameters<typeof getProductImageUrl>[0]
type Variant = Parameters<typeof getVariantImageUrl>[0]

export default function ProductImageView({ product, variants }: { product: Product; variants: Variant[] }) {
  return <ProductImageGallery key={product.id} images={[
    { src: getProductImageUrl(product), alt: product.name },
    ...variants.map(variant => ({ src: getVariantImageUrl(variant), alt: variant.name })),
  ]} />
}
