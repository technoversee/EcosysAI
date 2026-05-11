import { cn } from "@/lib/utils"

interface TreeAnimationProps {
  points: number
  className?: string
}

export default function TreeAnimation({ points, className }: TreeAnimationProps) {
  const stage = points >= 700 ? 4 : points >= 350 ? 3 : points >= 150 ? 2 : points >= 50 ? 1 : 0
  const labels = ["Seed", "Sprout", "Sapling", "Growing", "Fully Grown"]
  const emojis = ["🌰", "🌱", "🌿", "🌳", "🌲"]

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-forest/5 blur-2xl animate-breathe" />
        <svg viewBox="0 0 120 140" className="relative h-40 w-40 drop-shadow-lg transition-all duration-700">
          {stage === 0 && (
            <g className="animate-fadeIn">
              <ellipse cx="60" cy="130" rx="20" ry="6" fill="#8B5A2B" opacity={0.2} />
              <ellipse cx="60" cy="125" rx="5" ry="6" fill="#8B5A2B" />
              <ellipse cx="60" cy="121" rx="7" ry="5" fill="#52B788" opacity={0.85} />
              <ellipse cx="58" cy="118" rx="4" ry="4" fill="#95D5B2" />
            </g>
          )}
          {stage === 1 && (
            <g className="animate-fadeIn">
              <ellipse cx="60" cy="135" rx="24" ry="6" fill="#8B5A2B" opacity={0.2} />
              <rect x="57" y="85" width="6" height="45" rx="3" fill="#A98467" />
              <ellipse cx="60" cy="82" rx="16" ry="14" fill="#2D6A4F" />
              <ellipse cx="54" cy="78" rx="10" ry="8" fill="#52B788" />
              <ellipse cx="64" cy="74" rx="5" ry="4" fill="#95D5B2" />
            </g>
          )}
          {stage === 2 && (
            <g className="animate-fadeIn">
              <ellipse cx="60" cy="138" rx="28" ry="7" fill="#8B5A2B" opacity={0.2} />
              <rect x="55" y="65" width="10" height="68" rx="4" fill="#A98467" />
              <ellipse cx="60" cy="60" rx="26" ry="20" fill="#1B4332" />
              <ellipse cx="52" cy="56" rx="16" ry="12" fill="#2D6A4F" />
              <ellipse cx="68" cy="50" rx="10" ry="8" fill="#52B788" />
              <circle cx="44" cy="62" r="3" fill="#E9C46A" />
              <circle cx="72" cy="46" r="2.5" fill="#E9C46A" />
            </g>
          )}
          {stage === 3 && (
            <g className="animate-fadeIn">
              <ellipse cx="60" cy="140" rx="34" ry="8" fill="#8B5A2B" opacity={0.2} />
              <rect x="53" y="50" width="14" height="85" rx="5" fill="#A98467" />
              <ellipse cx="60" cy="44" rx="34" ry="24" fill="#1B4332" />
              <ellipse cx="48" cy="38" rx="20" ry="16" fill="#2D6A4F" />
              <ellipse cx="72" cy="32" rx="14" ry="12" fill="#52B788" />
              <ellipse cx="60" cy="54" rx="6" ry="4" fill="#D4A373" />
              <circle cx="42" cy="48" r="3.5" fill="#E9C46A" />
              <circle cx="76" cy="36" r="3" fill="#E9C46A" />
              <circle cx="56" cy="30" r="2.5" fill="#E9C46A" />
            </g>
          )}
          {stage === 4 && (
            <g className="animate-fadeIn">
              <ellipse cx="60" cy="140" rx="38" ry="9" fill="#8B5A2B" opacity={0.2} />
              <rect x="51" y="38" width="18" height="95" rx="6" fill="#A98467" />
              <ellipse cx="60" cy="32" rx="42" ry="28" fill="#1B4332" />
              <ellipse cx="46" cy="26" rx="24" ry="18" fill="#2D6A4F" />
              <ellipse cx="74" cy="22" rx="18" ry="14" fill="#52B788" />
              <ellipse cx="60" cy="48" rx="8" ry="5" fill="#D4A373" />
              <circle cx="38" cy="38" r="4" fill="#E9C46A" />
              <circle cx="78" cy="28" r="3.5" fill="#E9C46A" />
              <circle cx="54" cy="18" r="3" fill="#E9C46A" />
              <circle cx="66" cy="42" r="2.5" fill="#E9C46A" />
            </g>
          )}
        </svg>
      </div>
      <p className="mt-1.5 text-center text-sm font-medium text-forest dark:text-leaf">
        {emojis[stage]} {labels[stage]}
      </p>
    </div>
  )
}
