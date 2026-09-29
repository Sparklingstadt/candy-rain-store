import { notFound } from "next/navigation"
import { isShopifyEnabled } from "@/lib/shopify/config"
import ShopifyAccountManagement from "@/app/components/shopify/ShopifyAccountManagement"

export default function Page() {
  if (!isShopifyEnabled()) notFound()
  return <ShopifyAccountManagement section="payment" />
}
