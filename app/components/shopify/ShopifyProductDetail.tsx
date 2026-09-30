import { notFound } from "next/navigation"
import { getShopifyProduct } from "@/lib/shopify/catalog"
import Breadcrumb from "@/app/components/Breadcrumb"
import ShopifyProductActions from "./ShopifyProductActions"
import StoreNotice from "./StoreNotice"

export default async function ShopifyProductDetail({ handle }: { handle: string }) {
  let product
  try { product = await getShopifyProduct(handle) } catch { return <StoreNotice unavailable /> }
  if (!product) notFound()
  return <div className="space-y-8">
    <Breadcrumb items={[{ href: "/", label: "ホーム" }, { href: "/products", label: "商品一覧" }]} current={product.title} />
    <ShopifyProductActions product={product} />
  </div>
}
