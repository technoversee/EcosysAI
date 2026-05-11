import { Gift, QrCode } from "lucide-react"
import { REWARDS } from "@/lib/constants"

export default function RewardsPage() {
  return (
    <main className="page">
      <div className="page-inner">
        <div className="w-full">
          <p className="mb-1 text-xs font-medium text-accent">Perks</p>
          <h1 className="font-serif text-2xl font-semibold tracking-tight text-primary">Rewards</h1>
          <p className="mt-1 text-sm text-muted">Redeem points for eco-friendly perks</p>
        </div>

        <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2 text-sm font-medium text-accent">
          <span>🪙</span> 0 points available
        </div>

        <div className="grid w-full grid-cols-2 gap-3">
          {REWARDS.map((r) => (
            <div key={r.id} className="card flex flex-col items-center gap-2 p-5 text-center">
              <span className="text-2xl">{r.emoji}</span>
              <h3 className="text-sm font-semibold">{r.name}</h3>
              <p className="text-xs text-muted leading-snug">{r.description}</p>
              <div className="flex items-center gap-1 text-sm font-bold text-primary">
                <span>🪙</span> {r.cost}
              </div>
              <button disabled className="mt-1 w-full rounded-lg bg-primary/8 px-3 py-1.5 text-xs font-medium text-muted disabled:cursor-not-allowed">
                Redeem
              </button>
            </div>
          ))}
        </div>

        {/* mock QR */}
        <div className="w-full card p-5">
          <h3 className="flex items-center gap-2 text-sm font-medium">
            <QrCode size={15} className="text-primary" />
            Mock QR
          </h3>
          <div className="mt-4 flex flex-col items-center gap-3">
            <div className="flex h-28 w-28 items-center justify-center rounded-xl bg-primary/6 ring-1 ring-primary/8">
              <div className="grid grid-cols-5 gap-0.5">
                {Array.from({ length: 25 }).map((_, i) => (
                  <div key={i} className={`h-3.5 w-3.5 rounded-[2px] ${Math.random() > 0.5 ? "bg-primary" : "bg-surface"}`} />
                ))}
              </div>
            </div>
            <p className="text-xs text-muted">Show this to claim your reward</p>
          </div>
        </div>
      </div>
    </main>
  )
}
