"use client"

import { useState, useEffect, useCallback } from "react"
import { REWARDS } from "@/lib/constants"
import { useSession } from "next-auth/react"

interface RedemptionResult {
  success: boolean
  redemptionId: string
  reward: string
  cost: number
  pointsRemaining: number
}

export default function RewardsPage() {
  const { data: session } = useSession()
  const [search, setSearch] = useState("")
  const [points, setPoints] = useState(0)
  const [redeeming, setRedeeming] = useState<number | null>(null)
  const [coupon, setCoupon] = useState<RedemptionResult | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    fetch("/api/leaderboard")
      .then((r) => r.json())
      .then((data) => {
        const users = data.users as { id: string; points: number }[]
        const me = users.find((u) => u.id === session?.user?.id)
        if (me) setPoints(me.points)
      })
      .catch(() => {})
  }, [session])

  const filtered = REWARDS.filter(
    (r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.description.toLowerCase().includes(search.toLowerCase())
  )

  const handleRedeem = useCallback(
    async (rewardId: number) => {
      setRedeeming(rewardId)
      try {
        const res = await fetch("/api/redeem", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ rewardId }),
        })
        const data = await res.json()
        if (!res.ok) {
          alert(data.error || "Redemption failed")
          return
        }
        setCoupon(data)
        setPoints(data.pointsRemaining)
      } catch {
        alert("Network error")
      } finally {
        setRedeeming(null)
      }
    },
    []
  )

  const code = coupon ? `ECO-${coupon.redemptionId.slice(0, 6).toUpperCase()}` : ""
  const canvasRef = useCallback(
    (canvas: HTMLCanvasElement | null) => {
      if (!canvas || !coupon) return
      const ctx = canvas.getContext("2d")
      if (!ctx) return
      const size = 168
      canvas.width = size
      canvas.height = size
      ctx.fillStyle = "#fff"
      ctx.fillRect(0, 0, size, size)
      ctx.fillStyle = "#2d6a4f"
      const s = size / 21
      for (let i = 0; i < 21; i++)
        for (let j = 0; j < 21; j++) {
          if ((i * 7 + j * 13 + i * j * 3 + Math.floor((i + j) / 2)) % 3 !== 0)
            ctx.fillRect(i * s, j * s, s, s)
        }
      ctx.fillStyle = "#1a1a2e"
      ;([
        [0, 0],
        [0, 14],
        [14, 0],
      ] as const).forEach(([x, y]) => {
        ctx.fillRect(x * s, y * s, 7 * s, 7 * s)
        ctx.fillStyle = "#fff"
        ctx.fillRect((x + 1) * s, (y + 1) * s, 5 * s, 5 * s)
        ctx.fillStyle = "#1a1a2e"
        ctx.fillRect((x + 2) * s, (y + 2) * s, 3 * s, 3 * s)
        ctx.fillStyle = "#1a1a2e"
      })
    },
    [coupon]
  )

  return (
    <>
      <div className="section-title" style={{ marginTop: 0 }}>
        Reward Marketplace
      </div>
      <p className="section-desc">
        Redeem your EcoPoints for exclusive rewards. You have{" "}
        <strong style={{ color: "var(--emerald)" }}>{points}</strong> points.
      </p>

      <div className="search-wrap mb-24" style={{ maxWidth: "100%" }}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          placeholder="Search rewards..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "100%",
            padding: "10px 14px 10px 36px",
            fontSize: 14,
            fontFamily: "inherit",
            color: "var(--grey-700)",
            background: "var(--glass)",
            border: "1.5px solid var(--grey-200)",
            borderRadius: "var(--radius-sm)",
            outline: "none",
          }}
        />
      </div>

      <div className="reward-grid" id="rewardsGrid">
        {filtered.map((reward) => (
          <div className="reward-card" key={reward.id}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>{reward.emoji}</div>
            <div className="reward-brand">{reward.name}</div>
            <div className="reward-name" style={{ fontSize: 14, fontWeight: 600 }}>
              {reward.name}
            </div>
            <div style={{ fontSize: 13, color: "var(--grey-500)", marginBottom: 8 }}>
              {reward.description}
            </div>
            <div className="reward-points">
              <strong>{reward.cost}</strong> EcoPoints
            </div>
            <button
              className="reward-btn"
              disabled={redeeming === reward.id || points < reward.cost}
              onClick={() => handleRedeem(reward.id)}
              style={{
                opacity: points < reward.cost ? 0.5 : 1,
                cursor: points < reward.cost ? "not-allowed" : "pointer",
              }}
            >
              {redeeming === reward.id ? "Redeeming..." : points < reward.cost ? "Not Enough Points" : "Redeem"}
            </button>
          </div>
        ))}
        {filtered.length === 0 && (
          <p style={{ color: "var(--grey-400)", gridColumn: "1 / -1", textAlign: "center", padding: 40 }}>
            No rewards match your search.
          </p>
        )}
      </div>

      {coupon && (
        <>
          <div
            className="overlay show"
            style={{ zIndex: 200, cursor: "pointer" }}
            onClick={() => setCoupon(null)}
          />
          <div
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 201,
              width: "90%",
              maxWidth: 420,
            }}
          >
            <div className="scanner-container" style={{ margin: 0 }}>
              <div className="card text-center">
                <div className="coupon-brand">{coupon.reward}</div>
                <div className="coupon-code" id="couponCode">
                  {code}
                </div>
                <div style={{ fontSize: 14, color: "var(--grey-500)", marginBottom: 16 }}>
                  Redemption #{coupon.redemptionId.slice(0, 8)}
                </div>
                <div className="qr-box" id="qrBox">
                  <canvas ref={canvasRef} id="qrCanvas" />
                </div>
                <div className="coupon-expiry">
                  Expires in 7 days &bull;{" "}
                  {new Date(Date.now() + 7 * 86400000).toLocaleDateString()}
                </div>
              </div>
              <div className="coupon-actions">
                <button
                  className="btn-primary"
                  style={{ flex: 1, padding: 14 }}
                  onClick={() => {
                    navigator.clipboard.writeText(code)
                    setCopied(true)
                    setTimeout(() => setCopied(false), 2000)
                  }}
                >
                  {copied ? "Copied!" : "Copy Coupon Code"}
                </button>
                <button
                  className="btn-secondary"
                  style={{ flex: 1, padding: 14 }}
                  onClick={() => setCoupon(null)}
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}
