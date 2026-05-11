import { Gift, QrCode } from "lucide-react"
import { REWARDS } from "@/lib/constants"

export default function RewardsPage() {
  return (
    <main className="page">
      <div className="page-inner">
        {/* Header */}
        <div className="w-full">
          <div className="mb-1 inline-flex items-center gap-2 rounded-full bg-pine/8 px-3.5 py-1.5 text-xs font-medium text-pine">
            <Gift size={12} />
            Perks
          </div>
          <h1 className="font-serif text-xl font-semibold tracking-tight text-pine md:text-2xl lg:text-3xl">Rewards</h1>
          <p className="mt-1 text-sm text-warm-grey md:text-base">Redeem points for eco-friendly perks</p>
        </div>

        {/* Balance badge */}
        <div className="inline-flex items-center gap-2 rounded-full bg-clay/8 px-4 py-2 text-sm font-medium text-clay md:px-5 md:py-2.5 md:text-base">
          <span>🪙</span>
          <span>0 points available</span>
        </div>

        {/* Grid — responsive columns */}
        <div className="grid w-full grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-3">
          {REWARDS.map((reward) => (
            <div
              key={reward.id}
              className="group relative flex flex-col items-center gap-2 card p-5 text-center hover:ring-pine/20 md:p-6"
            >
              <div className="absolute -right-5 -top-5 h-14 w-14 rounded-full bg-pine/4 blur-xl transition-all group-hover:bg-pine/8" />
              <span className="relative text-2xl md:text-3xl">{reward.emoji}</span>
              <h3 className="relative text-sm font-semibold md:text-base">{reward.name}</h3>
              <p className="relative text-xs text-warm-grey leading-snug md:text-sm">{reward.description}</p>
              <div className="relative mt-0.5 flex items-center gap-1 text-sm font-bold text-pine md:text-base">
                <span>🪙</span> {reward.cost}
              </div>
              <button disabled className="relative mt-1 w-full rounded-lg bg-sage/15 px-3 py-1.5 text-xs font-medium text-warm-grey transition-all disabled:cursor-not-allowed md:rounded-xl md:py-2 md:text-sm">
                Redeem
              </button>
            </div>
          ))}
        </div>

        {/* Mock QR */}
        <div className="w-full card p-5 md:p-6">
          <h3 className="flex items-center gap-2 text-sm font-medium md:text-base">
            <QrCode size={15} className="text-pine md:size-4" />
            Mock QR Preview
          </h3>
          <div className="mt-4 flex flex-col items-center gap-3 md:flex-row md:gap-6 md:justify-center">
            <div className="flex h-32 w-32 items-center justify-center rounded-xl bg-pine/6 ring-1 ring-pine/8 md:h-36 md:w-36">
              <div className="grid grid-cols-5 gap-0.5">
                {Array.from({ length: 25 }).map((_, i) => (
                  <div key={i} className={`h-4 w-4 rounded-[3px] md:h-5 md:w-5 ${Math.random() > 0.5 ? "bg-pine" : "bg-sand"}`} />
                ))}
              </div>
            </div>
            <p className="text-xs text-warm-grey md:text-sm">Present this to claim your reward</p>
          </div>
        </div>
      </div>
    </main>
  )
}
