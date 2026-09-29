import Link from "next/link"
import { CreditCard, MapPin, UserRound } from "lucide-react"
import { customerAccountUrl } from "@/lib/shopify/account"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const sections = [
  { href: "/account/edit", title: "プロフィール", description: "氏名・メールアドレスを確認、変更します。", label: "アカウント情報を編集", Icon: UserRound },
  { href: "/account/address", title: "お届け先住所", description: "郵便番号を含む住所を追加・編集し、既定の住所を設定します。", label: "住所を管理", Icon: MapPin },
  { href: "/account/payment", title: "お支払い方法", description: "購入時の支払い方法とカード情報の入力について確認できます。", label: "お支払い方法を確認", Icon: CreditCard },
]

export default function ShopifyAccount() {
  return <div className="space-y-8">
    <header className="space-y-3">
      <h1 className="text-3xl font-semibold">アカウント・注文履歴</h1>
      <p className="text-muted-foreground">購入時のメールアドレスでShopifyのお客様アカウントにログインすると、登録情報と注文を管理できます。</p>
      <a href={customerAccountUrl()} className={buttonVariants()}>アカウント画面へ</a>
    </header>
    <section aria-label="アカウントの管理" className="grid gap-4 md:grid-cols-3">
      {sections.map(({ href, title, description, label, Icon }) => <Card key={href}>
        <CardHeader><Icon className="size-5 text-primary" aria-hidden="true" /><CardTitle>{title}</CardTitle><CardDescription>{description}</CardDescription></CardHeader>
        <CardContent><Link href={href} className={buttonVariants({ variant: "outline" })}>{label}</Link></CardContent>
      </Card>)}
    </section>
    <p className="text-sm text-muted-foreground">住所の変更は次回のお買い物に使用されます。注文済みのお届け先変更は、注文履歴からストアへお問い合わせください。</p>
  </div>
}
