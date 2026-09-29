import imageMapping from "../assets/candy-collection/shop-assets/image-mapping.json"

type ProductImageSource = {
  id: number
  name: string
  thumbnailImageUrl: string
}

type VariantImageSource = {
  id: number
  name: string
  productId: number
  imageUrl: string
}

// Use the bundled artwork even when an existing DB still contains placeholder URLs.
// Unknown catalog entries retain their own images.
export function getProductImageUrl(product: ProductImageSource): string {
  return imageMapping.products.find(
    entry => entry.id === product.id && entry.name === product.name
  )?.thumbnailImageUrl ?? product.thumbnailImageUrl
}

export function getVariantImageUrl(variant: VariantImageSource): string {
  return imageMapping.variants.find(
    entry => entry.id === variant.id && entry.productId === variant.productId && entry.name === variant.name
  )?.imageUrl ?? variant.imageUrl
}
