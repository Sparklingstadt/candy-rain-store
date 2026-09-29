import { isShopifyEnabled } from "@/lib/shopify/config"
import ShopifyAccountManagement from "@/app/components/shopify/ShopifyAccountManagement"
import Link from "next/link"
import { ChevronLeft, MapPin } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Page(){
  if (isShopifyEnabled()) return <ShopifyAccountManagement section="addresses" />
  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <Link href="/account" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><ChevronLeft className="size-4" /> アカウントへ戻る</Link>
      <div className="space-y-3"><Badge variant="secondary">Address book</Badge><h1 className="text-4xl font-semibold tracking-tight">設定住所</h1></div>
      <Card><CardHeader><MapPin className="size-5 text-primary" /><CardTitle>既定のお届け先</CardTitle></CardHeader><CardContent className="space-y-1 leading-7"><p className="font-medium">FIRSTN LASTN</p><p className="text-muted-foreground">000-0000</p><p className="text-muted-foreground">XX県 YY市 ZZ丁目</p><p className="text-muted-foreground">A-B-C号室</p></CardContent></Card>
    </div>
  )
}
