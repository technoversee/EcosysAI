import { REWARDS } from "@/lib/constants"

export default function RewardsPage() {
  return (
    <main className="flex flex-1 flex-col items-center px-4 pb-24 pt-6">
      <div className="flex w-full max-w-lg flex-col items-center">
        <h1 className="font-serif text-2xl font-semibold text-forest dark:text-leaf">Rewards</h1>
        <p className="mt-1 text-sm text-muted">Redeem your points for eco-friendly perks</p>

        <p className="mt-4 rounded-full bg-amber-100 px-4 py-1.5 text-sm font-medium text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
          🪙 0 points available
        </p>

        <div className="mt-6 grid w-full grid-cols-2 gap-3">
          {REWARDS.map((reward) => (
            <div
              key={reward.id}
              className="flex flex-col items-center gap-2 rounded-2xl bg-card p-4 text-center shadow-sm ring-1 ring-card-border transition-all hover:ring-forest"
            >
              <span className="text-3xl">{reward.emoji}</span>
              <h3 className="text-sm font-semibold">{reward.name}</h3>
              <p className="text-xs text-muted">{reward.description}</p>
              <div className="mt-1 flex items-center gap-1 text-sm font-bold text-forest dark:text-leaf">
                <span>🪙</span> {reward.cost}
              </div>
              <button
                disabled
                className="mt-1 w-full rounded-full bg-sage/30 px-3 py-1.5 text-xs font-medium text-muted disabled:cursor-not-allowed"
              >
                Redeem
              </button>
            </div>
          ))}
        </div>

        <div className="mt-6 w-full rounded-2xl bg-card p-4 shadow-sm ring-1 ring-card-border">
          <h3 className="text-sm font-medium">Mock QR Preview</h3>
          <div className="mt-3 flex flex-col items-center gap-2">
            <div className="flex h-32 w-32 items-center justify-center rounded-xl bg-forest/10">
              <div className="grid grid-cols-5 gap-0.5">
                {Array.from({ length: 25 }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-4 w-4 ${Math.random() > 0.5 ? "bg-forest" : "bg-cream"} rounded-sm`}
                  />
                ))}
              </div>
            </div>
            <p className="text-xs text-muted">Present this at the counter</p>
          </div>
        </div>
      </div>
    </main>
  )
}
