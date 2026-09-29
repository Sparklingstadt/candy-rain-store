import { isShopifyEnabled } from "@/lib/shopify/config"
import Link from "next/link"
import { ArrowRight, Boxes, ShieldCheck, Sparkles } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Page(){
  const shopify = isShopifyEnabled()
  return (
    <div className="space-y-20">
      <section className="grid min-h-[60vh] items-center gap-12 py-8 lg:grid-cols-[1.15fr_.85fr] lg:py-16">
        <div className="space-y-7">
          <Badge variant="secondary" className="gap-1.5"><Sparkles /> {shopify ? "Candy Rain Store" : "Full-stack demo store"}</Badge>
          <div className="space-y-5">
            <h1 className="max-w-3xl text-5xl font-semibold tracking-[-0.04em] sm:text-6xl lg:text-7xl">小さなときめきを、ひと箱に。</h1>
            <p className="max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl">{shopify ? "毎日に小さな彩りを添える、Candy Rain Storeのオリジナルグッズをお届けします。" : "Candy Rain Storeは、商品選びから注文履歴までのEC購入体験を実装したデモストアです。"}</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/products" className={buttonVariants({ size: "lg", className: "h-11 px-5" })}>商品を見る <ArrowRight /></Link>
            <Link href="/account" className={buttonVariants({ variant: "outline", size: "lg", className: "h-11 px-5" })}>アカウント</Link>
          </div>
        </div>
        <div className="relative rounded-[2rem] border bg-card p-6 shadow-2xl shadow-primary/10 sm:p-10">
          <div className="absolute -right-4 -top-4 size-28 rounded-full bg-accent/70 blur-2xl" />
          <div className="relative grid gap-4 sm:grid-cols-2">
            {["選ぶ", "カート", "購入", "履歴"].map((label, index) => (
              <div key={label} className="rounded-2xl border bg-background/80 p-6">
                <span className="text-xs font-semibold text-primary">0{index + 1}</span>
                <p className="mt-8 text-xl font-medium">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {!shopify && <section className="grid gap-4 md:grid-cols-3">
        <Card><CardHeader><Boxes className="size-5 text-primary" /><CardTitle>フルスタック設計</CardTitle></CardHeader><CardContent className="leading-6 text-muted-foreground">Next.js、Prisma、PostgreSQLで購入フローをレイヤーごとに実装しています。</CardContent></Card>
        <Card><CardHeader><ShieldCheck className="size-5 text-primary" /><CardTitle>自動品質確認</CardTitle></CardHeader><CardContent className="leading-6 text-muted-foreground">単体・DB統合・Playwright E2EをGitHub Actionsで継続的に確認します。</CardContent></Card>
        <Card><CardHeader><Sparkles className="size-5 text-primary" /><CardTitle>正常系に集中</CardTitle></CardHeader><CardContent className="leading-6 text-muted-foreground">学習用デモとして、迷いのないシンプルな購入体験を優先しています。</CardContent></Card>
      </section>}
    </div>
  )
}
