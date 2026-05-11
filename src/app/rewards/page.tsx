"use client"

import { useState, useEffect } from "react"
import { Gift, QrCode, X, CheckCircle, AlertCircle } from "lucide-react"
import { REWARDS } from "@/lib/constants"

export default function RewardsPage() {
  const [points, setPoints] = useState<number | null>(null)
  const [redeeming, setRedeeming] = useState<number | null>(null)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [showQr, setShowQr] = useState<{ name: string; cost: number } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/leaderboard")
      .then((r) => r.json())
      .then((data) => {
        if (data.users?.length) {
          const me = data.users[0]
          setPoints(me.points)
        } else {
          setPoints(0)
        }
      })
      .catch(() => setPoints(0))
      .finally(() => setLoading(false))
  }, [])

  async function handleRedeem(rewardId: number) {
    setRedeeming(rewardId)
    setMessage(null)
    try {
      const res = await fetch("/api/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rewardId }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setPoints(data.pointsRemaining)
      setMessage({ type: "success", text: `Redeemed ${data.reward}!` })
      setTimeout(() => setShowQr({ name: data.reward, cost: data.cost }), 500)
    } catch (e: any) {
      setMessage({ type: "error", text: e.message })
    } finally {
      setRedeeming(null)
    }
  }

  return (
    <main className="flex flex-1 flex-col items-center px-4 pb-24 pt-6">
      <div className="flex w-full max-w-lg flex-col items-center">
        <h1 className="font-serif text-2xl font-semibold text-forest dark:text-leaf">Rewards</h1>
        <p className="mt-1 text-sm text-muted">Redeem your points for eco-friendly perks</p>

        <p className="mt-4 rounded-full bg-amber-100 px-4 py-1.5 text-sm font-medium text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
          🪙 {loading ? "..." : points ?? 0} points available
        </p>

        {message && (
          <div className={`mt-4 flex w-full items-center gap-2 rounded-xl px-4 py-3 text-sm ${
            message.type === "success" ? "bg-success/10 text-success" : "bg-danger/10 text-danger"
          }`}>
            {message.type === "success" ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
            {message.text}
          </div>
        )}

        <div className="mt-6 grid w-full grid-cols-2 gap-3">
          {REWARDS.map((reward) => {
            const affordable = points !== null && points >= reward.cost
            return (
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
                  onClick={() => handleRedeem(reward.id)}
                  disabled={!affordable || redeeming === reward.id}
                  className={`mt-1 w-full rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                    affordable
                      ? "bg-forest text-white hover:bg-forest-light active:scale-[0.98]"
                      : "bg-sage/30 text-muted cursor-not-allowed"
                  }`}
                >
                  {redeeming === reward.id ? "Redeeming..." : affordable ? "Redeem" : "Not enough"}
                </button>
              </div>
            )
          })}
        </div>

        <div className="mt-6 w-full rounded-2xl bg-card p-4 shadow-sm ring-1 ring-card-border">
          <h3 className="text-sm font-medium">Mock QR Preview</h3>
          <div className="mt-3 flex flex-col items-center gap-2">
            <div className="flex h-32 w-32 items-center justify-center rounded-xl bg-forest/10">
              <div className="grid grid-cols-5 gap-0.5">
                {Array.from({ length: 25 }).map((_, i) => (
                  <div key={i} className={`h-4 w-4 ${Math.random() > 0.5 ? "bg-forest" : "bg-cream"} rounded-sm`} />
                ))}
              </div>
            </div>
            <p className="text-xs text-muted">Present this at the counter</p>
          </div>
        </div>
      </div>

      {/* QR Modal */}
      {showQr && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setShowQr(null)}>
          <div className="mx-4 w-full max-w-xs rounded-3xl bg-card p-6 text-center shadow-xl ring-1 ring-card-border" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setShowQr(null)} className="float-right text-muted hover:text-foreground">
              <X size={18} />
            </button>
            <CheckCircle size={40} className="mx-auto text-success" />
            <h3 className="mt-3 font-serif text-lg font-semibold">Redeemed!</h3>
            <p className="mt-1 text-sm text-muted">{showQr.name}</p>
            <div className="mx-auto mt-4 flex h-36 w-36 items-center justify-center rounded-2xl bg-forest/10 ring-1 ring-forest/20">
              <div className="grid grid-cols-5 gap-0.5">
                {Array.from({ length: 25 }).map((_, i) => (
                  <div key={i} className={`h-5 w-5 rounded-[3px] ${Math.random() > 0.5 ? "bg-forest" : "bg-cream"}`} />
                ))}
              </div>
            </div>
            <p className="mt-3 text-xs text-muted">Show this QR at the counter to claim</p>
            <button
              onClick={() => setShowQr(null)}
              className="mt-4 w-full rounded-full bg-forest py-2.5 text-sm font-medium text-white transition-colors hover:bg-forest-light"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </main>
  )
}
