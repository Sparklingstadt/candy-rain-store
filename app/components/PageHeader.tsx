import type { CandyTone } from "@/lib/candy"
import CandyPill from "./CandyPill"

export default function PageHeader({ eyebrow, title, description, tone = "pink", actions }: {
  eyebrow?: string
  title: React.ReactNode
  description?: React.ReactNode
  tone?: CandyTone
  actions?: React.ReactNode
}) {
  return (
    <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div className="space-y-3">
        {eyebrow && <CandyPill tone={tone}>{eyebrow}</CandyPill>}
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">{title}</h1>
        {description && <p className="max-w-2xl leading-7 text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap gap-3">{actions}</div>}
    </header>
  )
}
