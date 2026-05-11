import { cn } from "@/lib/utils"

const TREES = [
  // Stage 0 — Seed (0 pts)
  <svg key={0} viewBox="0 0 120 140" className="h-36 w-36">
    <ellipse cx="60" cy="120" rx="18" ry="6" fill="#8B5A2B" opacity={0.3} />
    <ellipse cx="60" cy="115" rx="4" ry="5" fill="#8B5A2B" />
    <ellipse cx="60" cy="111" rx="6" ry="4" fill="#52B788" opacity={0.8} />
    <ellipse cx="58" cy="108" rx="3" ry="3" fill="#95D5B2" />
  </svg>,

  // Stage 1 — Sprout (50 pts)
  <svg key={1} viewBox="0 0 120 140" className="h-36 w-36">
    <ellipse cx="60" cy="130" rx="22" ry="6" fill="#8B5A2B" opacity={0.3} />
    <rect x="57" y="80" width="6" height="45" rx="3" fill="#8B5A2B" />
    <ellipse cx="60" cy="80" rx="14" ry="12" fill="#52B788" />
    <ellipse cx="54" cy="76" rx="8" ry="6" fill="#95D5B2" />
  </svg>,

  // Stage 2 — Sapling (150 pts)
  <svg key={2} viewBox="0 0 120 140" className="h-36 w-36">
    <ellipse cx="60" cy="135" rx="28" ry="7" fill="#8B5A2B" opacity={0.3} />
    <rect x="56" y="65" width="8" height="65" rx="4" fill="#A98467" />
    <ellipse cx="60" cy="62" rx="22" ry="18" fill="#2D6A4F" />
    <ellipse cx="54" cy="58" rx="14" ry="10" fill="#52B788" />
    <ellipse cx="66" cy="52" rx="8" ry="6" fill="#95D5B2" />
  </svg>,

  // Stage 3 — Growing tree (350 pts)
  <svg key={3} viewBox="0 0 120 140" className="h-36 w-36">
    <ellipse cx="60" cy="135" rx="32" ry="8" fill="#8B5A2B" opacity={0.3} />
    <rect x="54" y="50" width="12" height="80" rx="5" fill="#A98467" />
    <ellipse cx="60" cy="45" rx="30" ry="22" fill="#2D6A4F" />
    <ellipse cx="50" cy="40" rx="18" ry="14" fill="#52B788" />
    <ellipse cx="70" cy="34" rx="12" ry="10" fill="#95D5B2" />
    <circle cx="45" cy="48" r="3" fill="#E9C46A" />
    <circle cx="70" cy="38" r="2.5" fill="#E9C46A" />
  </svg>,

  // Stage 4 — Fully grown (700+ pts)
  <svg key={4} viewBox="0 0 120 140" className="h-36 w-36">
    <ellipse cx="60" cy="138" rx="36" ry="9" fill="#8B5A2B" opacity={0.3} />
    <rect x="52" y="40" width="16" height="90" rx="6" fill="#A98467" />
    <ellipse cx="60" cy="35" rx="38" ry="26" fill="#2D6A4F" />
    <ellipse cx="48" cy="30" rx="22" ry="16" fill="#52B788" />
    <ellipse cx="72" cy="26" rx="16" ry="12" fill="#95D5B2" />
    <circle cx="42" cy="40" r="3.5" fill="#E9C46A" />
    <circle cx="75" cy="30" r="3" fill="#E9C46A" />
    <circle cx="55" cy="22" r="2.5" fill="#E9C46A" />
    <ellipse cx="60" cy="42" rx="6" ry="4" fill="#D4A373" />
  </svg>,
]

interface TreeAnimationProps {
  points: number
  className?: string
}

export default function TreeAnimation({ points, className }: TreeAnimationProps) {
  const stage =
    points >= 700 ? 4 : points >= 350 ? 3 : points >= 150 ? 2 : points >= 50 ? 1 : 0

  const labels = ["Seed", "Sprout", "Sapling", "Growing", "Fully Grown"]
  const emojis = ["🌰", "🌱", "🌿", "🌳", "🌲"]

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div className="transition-all duration-700 ease-in-out">{TREES[stage]}</div>
      <p className="mt-1 text-sm font-medium text-forest dark:text-leaf">
        {emojis[stage]} {labels[stage]}
      </p>
    </div>
  )
}
