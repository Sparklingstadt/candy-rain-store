import { shopifyDomain } from "@/lib/shopify/config"
import { buttonVariants } from "@/components/ui/button"

export default function ShopifyAccount() {
  return <div className="space-y-6 rounded-2xl border bg-card p-8">
    <h1 className="text-3xl font-semibold">アカウント・注文履歴</h1>
    <p className="text-muted-foreground">ご注文の確認やアカウントの管理は、購入時のメールアドレスでストアのアカウント画面にログインしてください。</p>
    <a href={`https://${shopifyDomain()}/account`} className={buttonVariants()}>アカウント画面へ</a>
  </div>
}
