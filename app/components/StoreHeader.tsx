"use client"

import Link from "next/link"
import { Code2, Menu, ShoppingBag, Sparkles } from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

const navigation = [
  { href: "/products", label: "Products" },
  { href: "/orders", label: "Orders" },
  { href: "/account", label: "Account" },
]

export default function StoreHeader({ cartItemCount, signedIn }: { cartItemCount: number, signedIn: boolean }) {
  const cartLabel = `カート(${cartItemCount})`

  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur-xl">
      <div className="page-shell flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Sparkles className="size-4" />
          </span>
          <span>Candy Rain Store</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="メインナビゲーション">
          {navigation.map((item) => (
            <Link key={item.href} href={item.href} className={buttonVariants({ variant: "ghost" })}>
              {item.label}
            </Link>
          ))}
          <Link href="/cart" className={cn(buttonVariants({ variant: "outline" }), "ml-2")}>
            <ShoppingBag data-icon="inline-start" />
            {cartLabel}
          </Link>
          <a href="https://github.com/Sparklingstadt/prd-candy-rain-store" target="_blank" rel="noreferrer" className={buttonVariants({ variant: "ghost", size: "icon" })}>
            <Code2 />
            <span className="sr-only">GitHub</span>
          </a>
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <Link
            href="/cart"
            aria-label={cartLabel}
            className={cn(buttonVariants({ variant: "outline" }), "gap-1 px-2.5")}
          >
            <ShoppingBag />
            <span>({cartItemCount})</span>
          </Link>
          <Sheet>
            <SheetTrigger render={<Button variant="outline" size="icon" />}>
              <Menu />
              <span className="sr-only">メニューを開く</span>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Candy Rain Store</SheetTitle>
                <SheetDescription>{signedIn ? "サインイン中" : "ゲスト"} ・ ストアメニュー</SheetDescription>
              </SheetHeader>
              <nav className="flex flex-col gap-2 px-4" aria-label="モバイルナビゲーション">
                {navigation.map((item) => (
                  <Link key={item.href} href={item.href} className={cn(buttonVariants({ variant: "ghost" }), "justify-start")}>
                    {item.label}
                  </Link>
                ))}
                <Link href="/cart" className={cn(buttonVariants({ variant: "secondary" }), "justify-start")}>
                  <ShoppingBag data-icon="inline-start" />
                  {cartLabel}
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
