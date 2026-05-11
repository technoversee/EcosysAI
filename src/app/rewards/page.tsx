"use client"

import { useState, useEffect } from "react"
import { Gift, QrCode, X, CheckCircle, AlertCircle } from "lucide-react"
import { REWARDS } from "@/lib/constants"

export default function RewardsPage() {
  const [points, setPoints] = useState<number | null>(null)
  const [redeeming, setRedeeming] = useState<number | null>(null)
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [showQr, setShowQr] = useState<{ name: string; cost: number } | null>(null)

  useEffect(() => {
    fetch("/api/leaderboard").then((r) => r.json()).then((d) => {
      if (d.users?.length) setPoints(d.users[0].points); else setPoints(0)
    }).catch(() => setPoints(0))
  }, [])

  async function handleRedeem(id: number) {
    setRedeeming(id); setMsg(null)
    try {
      const res = await fetch("/api/redeem", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ rewardId: id }) })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setPoints(data.pointsRemaining)
      setMsg({ type: "success", text: `Redeemed ${data.reward}!` })
      setTimeout(() => setShowQr({ name: data.reward, cost: data.cost }), 500)
    } catch (e: any) { setMsg({ type: "error", text: e.message }) }
    finally { setRedeeming(null) }
  }

  return (
    <main className="page">
      <div className="page-inner">
        <div className="w-full">
          <div className="mb-1 inline-flex items-center gap-2 rounded-full bg-pine/8 px-3.5 py-1.5 text-xs font-medium text-pine"><Gift size={12} /> Perks</div>
          <h1 className="font-serif text-xl font-semibold tracking-tight text-pine md:text-2xl lg:text-3xl">Rewards</h1>
          <p className="mt-1 text-sm text-warm-grey md:text-base">Redeem points for eco-friendly perks</p>
        </div>

        <div className="inline-flex items-center gap-2 rounded-full bg-clay/8 px-4 py-2 text-sm font-medium text-clay md:px-5 md:py-2.5 md:text-base">
          <span>🪙</span> {points !== null ? points : "..." } points available
        </div>

        {msg && (
          <div className={`flex w-full items-center gap-2 rounded-xl px-4 py-3 text-sm ${msg.type === "success" ? "bg-success/10 text-success" : "bg-danger/10 text-danger"}`}>
            {msg.type === "success" ? <CheckCircle size={16} /> : <AlertCircle size={16} />} {msg.text}
          </div>
        )}

        <div className="grid w-full grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-3">
          {REWARDS.map((reward) => {
            const affordable = points !== null && points >= reward.cost
            return (
              <div key={reward.id} className="group relative flex flex-col items-center gap-2 card p-5 text-center hover:ring-pine/20 md:p-6">
                <div className="absolute -right-5 -top-5 h-14 w-14 rounded-full bg-pine/4 blur-xl transition-all group-hover:bg-pine/8" />
                <span className="relative text-2xl md:text-3xl">{reward.emoji}</span>
                <h3 className="relative text-sm font-semibold md:text-base">{reward.name}</h3>
                <p className="relative text-xs text-warm-grey leading-snug md:text-sm">{reward.description}</p>
                <div className="relative mt-0.5 flex items-center gap-1 text-sm font-bold text-pine md:text-base"><span>🪙</span> {reward.cost}</div>
                <button onClick={() => handleRedeem(reward.id)} disabled={!affordable || redeeming === reward.id}
                  className={`relative mt-1 w-full rounded-lg px-3 py-1.5 text-xs font-medium transition-all md:rounded-xl md:py-2 md:text-sm ${affordable ? "bg-pine text-white hover:bg-pine-light active:scale-[0.98]" : "bg-sage/15 text-warm-grey cursor-not-allowed"}`}>
                  {redeeming === reward.id ? "..." : affordable ? "Redeem" : "Locked"}
                </button>
              </div>
            )
          })}
        </div>

        <div className="w-full card p-5 md:p-6">
          <h3 className="flex items-center gap-2 text-sm font-medium md:text-base"><QrCode size={15} className="text-pine md:size-4" /> Mock QR Preview</h3>
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

      {showQr && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setShowQr(null)}>
          <div className="mx-4 w-full max-w-xs rounded-3xl bg-card p-6 text-center shadow-xl ring-1 ring-card-border" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setShowQr(null)} className="float-right text-warm-grey hover:text-fg"><X size={18} /></button>
            <CheckCircle size={40} className="mx-auto text-success" />
            <h3 className="mt-3 font-serif text-lg font-semibold">Redeemed!</h3>
            <p className="mt-1 text-sm text-warm-grey">{showQr.name}</p>
            <div className="mx-auto mt-4 flex h-36 w-36 items-center justify-center rounded-2xl bg-pine/10 ring-1 ring-pine/20">
              <div className="grid grid-cols-5 gap-0.5">
                {Array.from({ length: 25 }).map((_, i) => (
                  <div key={i} className={`h-5 w-5 rounded-[3px] ${Math.random() > 0.5 ? "bg-pine" : "bg-sand"}`} />
                ))}
              </div>
            </div>
            <p className="mt-3 text-xs text-warm-grey">Show this QR at the counter to claim</p>
            <button onClick={() => setShowQr(null)} className="mt-4 w-full rounded-full bg-pine py-2.5 text-sm font-medium text-white transition-colors hover:bg-pine-light">Done</button>
          </div>
        </div>
      )}
    </main>
  )
}
