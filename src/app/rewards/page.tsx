import { Gift, Sparkles } from "lucide-react"
import { REWARDS } from "@/lib/constants"

export default function RewardsPage() {
  return (
    <main className="flex flex-1 flex-col items-center px-5 pb-28 pt-4">
      <div className="flex w-full max-w-lg flex-col items-center">
        {/* Header */}
        <div className="relative w-full overflow-hidden rounded-3xl bg-gradient-to-b from-forest/10 via-forest/5 to-transparent p-8 text-center">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-forest/5 blur-3xl" />
          <div className="relative">
            <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-2xl bg-forest/10 dark:bg-leaf/10">
              <Gift size={18} className="text-forest dark:text-leaf" />
            </div>
            <h1 className="font-serif text-2xl font-semibold tracking-tight text-forest dark:text-leaf">
              Rewards
            </h1>
            <p className="mt-1.5 text-sm text-muted">Redeem your points for eco-friendly perks</p>
          </div>
        </div>

        {/* Balance */}
        <div className="mt-5 flex items-center gap-2 rounded-full bg-amber/10 px-5 py-2 text-sm font-medium text-amber-800 dark:text-amber-300">
          <span>🪙</span>
          <span>0 points available</span>
        </div>

        {/* Grid */}
        <div className="mt-6 grid w-full grid-cols-2 gap-3">
          {REWARDS.map((reward) => (
            <div
              key={reward.id}
              className="group relative flex flex-col items-center gap-2 overflow-hidden rounded-2xl bg-card/70 p-5 text-center shadow-sm ring-1 ring-card-border backdrop-blur-lg transition-all duration-200 hover:ring-forest/30"
            >
              <div className="absolute -right-6 -top-6 h-16 w-16 rounded-full bg-forest/5 blur-xl transition-all group-hover:bg-forest/10" />
              <span className="relative text-3xl">{reward.emoji}</span>
              <h3 className="relative text-sm font-semibold">{reward.name}</h3>
              <p className="relative text-xs text-muted">{reward.description}</p>
              <div className="relative mt-1 flex items-center gap-1 text-sm font-bold text-forest dark:text-leaf">
                <span>🪙</span> {reward.cost}
              </div>
              <button
                disabled
                className="relative mt-1 w-full rounded-full bg-sage/20 px-4 py-2 text-xs font-medium text-muted backdrop-blur-sm transition-all disabled:cursor-not-allowed"
              >
                Redeem
              </button>
            </div>
          ))}
        </div>

        {/* Mock QR */}
        <div className="mt-6 w-full overflow-hidden rounded-2xl bg-card/70 p-5 shadow-sm ring-1 ring-card-border backdrop-blur-lg">
          <h3 className="text-sm font-medium">Mock QR Preview</h3>
          <div className="mt-4 flex flex-col items-center gap-3">
            <div className="flex h-36 w-36 items-center justify-center rounded-2xl bg-forest/5 ring-1 ring-forest/10">
              <div className="grid grid-cols-5 gap-0.5">
                {Array.from({ length: 25 }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-5 w-5 rounded-sm ${Math.random() > 0.5 ? "bg-forest" : "bg-cream"}`}
                  />
                ))}
              </div>
            </div>
            <p className="text-xs text-muted">Present this at the counter to claim your reward</p>
          </div>
        </div>
      </div>
    </main>
  )
}
