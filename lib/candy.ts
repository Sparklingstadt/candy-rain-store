// Candy drops palette. Class names are listed in full so Tailwind can detect them.
export const candyTones = ["pink", "mint", "lemon", "lavender"] as const
export type CandyTone = (typeof candyTones)[number]

export const candyToneClasses: Record<CandyTone, { surface: string; strong: string; text: string }> = {
  pink: { surface: "bg-candy-pink", strong: "bg-candy-pink-strong", text: "text-candy-pink-foreground" },
  mint: { surface: "bg-candy-mint", strong: "bg-candy-mint-strong", text: "text-candy-mint-foreground" },
  lemon: { surface: "bg-candy-lemon", strong: "bg-candy-lemon-strong", text: "text-candy-lemon-foreground" },
  lavender: { surface: "bg-candy-lavender", strong: "bg-candy-lavender-strong", text: "text-candy-lavender-foreground" },
}

export function candyToneAt(index: number): CandyTone {
  return candyTones[index % candyTones.length]
}
