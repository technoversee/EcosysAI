interface Props { points: number; className?: string }

export default function TreeAnimation({ points, className = "" }: Props) {
  const stage = points >= 700 ? 4 : points >= 350 ? 3 : points >= 150 ? 2 : points >= 50 ? 1 : 0
  const labels = ["Seed", "Sprout", "Sapling", "Growing", "Fully Grown"]
  const emojis = ["🌰", "🌱", "🌿", "🌳", "🌲"]

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-primary/5 blur-2xl animate-breathe" />
        <svg viewBox="0 0 120 140" className="relative h-32 w-32 transition-all duration-700">
          {stage === 0 && (
            <g className="animate-fadeIn">
              <ellipse cx="60" cy="130" rx="18" ry="5" fill="#c48a5a" opacity={0.15} />
              <ellipse cx="60" cy="126" rx="4" ry="5" fill="#8b7a6a" />
              <ellipse cx="60" cy="122" rx="6" ry="4" fill="#5a7d6b" opacity={0.85} />
              <ellipse cx="58" cy="119" rx="3.5" ry="3.5" fill="#7baf8a" />
            </g>
          )}
          {stage === 1 && (
            <g className="animate-fadeIn">
              <ellipse cx="60" cy="135" rx="22" ry="5" fill="#c48a5a" opacity={0.15} />
              <rect x="57" y="86" width="6" height="44" rx="3" fill="#8b7a6a" />
              <ellipse cx="60" cy="84" rx="14" ry="12" fill="#2d4a3e" />
              <ellipse cx="54" cy="80" rx="8" ry="7" fill="#5a7d6b" />
            </g>
          )}
          {stage === 2 && (
            <g className="animate-fadeIn">
              <ellipse cx="60" cy="138" rx="26" ry="6" fill="#c48a5a" opacity={0.15} />
              <rect x="55" y="66" width="10" height="67" rx="4" fill="#8b7a6a" />
              <ellipse cx="60" cy="62" rx="24" ry="18" fill="#2d4a3e" />
              <ellipse cx="52" cy="58" rx="14" ry="11" fill="#2d4a3e" />
              <ellipse cx="68" cy="52" rx="9" ry="7" fill="#5a7d6b" />
              <circle cx="44" cy="63" r="2.5" fill="#d4a05a" />
              <circle cx="70" cy="48" r="2" fill="#d4a05a" />
            </g>
          )}
          {stage === 3 && (
            <g className="animate-fadeIn">
              <ellipse cx="60" cy="140" rx="30" ry="7" fill="#c48a5a" opacity={0.15} />
              <rect x="53" y="50" width="14" height="85" rx="5" fill="#8b7a6a" />
              <ellipse cx="60" cy="46" rx="32" ry="22" fill="#2d4a3e" />
              <ellipse cx="48" cy="40" rx="18" ry="14" fill="#2d4a3e" />
              <ellipse cx="72" cy="36" rx="12" ry="10" fill="#5a7d6b" />
              <ellipse cx="60" cy="56" rx="5" ry="3.5" fill="#c48a5a" />
              <circle cx="42" cy="50" r="3" fill="#d4a05a" />
              <circle cx="74" cy="38" r="2.5" fill="#d4a05a" />
              <circle cx="56" cy="32" r="2" fill="#d4a05a" />
            </g>
          )}
          {stage === 4 && (
            <g className="animate-fadeIn">
              <ellipse cx="60" cy="140" rx="34" ry="8" fill="#c48a5a" opacity={0.15} />
              <rect x="51" y="38" width="18" height="95" rx="6" fill="#8b7a6a" />
              <ellipse cx="60" cy="34" rx="40" ry="26" fill="#2d4a3e" />
              <ellipse cx="46" cy="28" rx="22" ry="16" fill="#2d4a3e" />
              <ellipse cx="74" cy="26" rx="16" ry="12" fill="#5a7d6b" />
              <ellipse cx="60" cy="50" rx="6" ry="4" fill="#c48a5a" />
              <circle cx="38" cy="40" r="3.5" fill="#d4a05a" />
              <circle cx="76" cy="30" r="3" fill="#d4a05a" />
              <circle cx="54" cy="20" r="2.5" fill="#d4a05a" />
              <circle cx="64" cy="44" r="2" fill="#d4a05a" />
            </g>
          )}
        </svg>
      </div>
      <p className="mt-1.5 text-xs font-medium text-primary">{emojis[stage]} {labels[stage]}</p>
    </div>
  )
}
