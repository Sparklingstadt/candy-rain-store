import Link from "next/link"

export default function Breadcrumb({ items, current }: { items: { href: string; label: string }[]; current: string }) {
  return (
    <nav aria-label="パンくずリスト">
      <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
        {items.map(item => (
          <li key={item.href} className="flex items-center gap-2">
            <Link href={item.href} className="hover:text-foreground">{item.label}</Link>
            <span aria-hidden="true" className="text-border">/</span>
          </li>
        ))}
        <li aria-current="page" className="font-medium text-foreground">{current}</li>
      </ol>
    </nav>
  )
}
