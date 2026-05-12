"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { REWARDS, ACHIEVEMENTS } from "@/lib/constants"
import TreeAnimation from "@/components/TreeAnimation"

interface LeaderUser {
  id: string; name: string; email: string; image: string; points: number; scans: number
}

interface ScanBreakdown {
  user_id: string; material: string; count: number
}

interface TrendPoint {
  count: number; day?: string; month?: string
}

interface Achievement {
  id: string; name: string; desc: string; icon: string; unlocked: boolean
}

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

function greeting(): string {
  const h = new Date().getHours()
  if (h < 12) return "Good Morning"
  if (h < 17) return "Good Afternoon"
  return "Good Evening"
}

function computeCo2(scans: number): string {
  return (scans * 0.4).toFixed(1)
}

function getAchievements(scans: number, points: number, materials: Record<string, number>): Achievement[] {
  return ACHIEVEMENTS.map((a) => ({
    id: a.id,
    name: a.name,
    desc: a.desc,
    icon: a.icon,
    unlocked: a.check(scans, points, materials),
  }))
}

export default function DashboardPage() {
  const { data: session } = useSession()
  const [leaderboard, setLeaderboard] = useState<LeaderUser[]>([])
  const [breakdown, setBreakdown] = useState<ScanBreakdown[]>([])
  const [trends, setTrends] = useState<TrendPoint[]>([])
  const [loading, setLoading] = useState(true)
  const [chartFilter, setChartFilter] = useState<"week" | "month" | "year">("week")

  useEffect(() => {
    fetch("/api/leaderboard")
      .then((r) => r.json())
      .then((data) => {
        setLeaderboard(data.users ?? [])
        setBreakdown(data.breakdown ?? [])
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    fetch(`/api/scans/trends?range=${chartFilter}`)
      .then((r) => r.json())
      .then((data) => setTrends(data.data ?? []))
      .catch(() => {})
  }, [chartFilter])

  const currentUser = leaderboard.find((u) => u.id === session?.user?.id)
  const totalScans = currentUser?.scans ?? 0
  const ecoPoints = currentUser?.points ?? 0
  const co2Saved = computeCo2(totalScans)
  const wasteRecycled = totalScans

  const totalItemsRecycled = leaderboard.reduce((sum, u) => sum + u.scans, 0)
  const myBreakdown = breakdown.filter((b) => b.user_id === session?.user?.id)
  const weeklyItems = myBreakdown.reduce((sum, b) => sum + b.count, 0) || Math.min(totalScans, 24)

  const materialCounts: Record<string, number> = {}
  for (const b of myBreakdown) materialCounts[b.material] = (materialCounts[b.material] || 0) + b.count

  const achievements = getAchievements(totalScans, ecoPoints, materialCounts)
  const unlockedCount = achievements.filter((a) => a.unlocked).length

  const greet = greeting()
  const name = session?.user?.name || "User"

  // Build chart from real trends data
  const chartData: number[] = []
  const chartLabels: string[] = []

  if (chartFilter === "week") {
    const byDay: Record<string, number> = {}
    for (const t of trends) if (t.day !== undefined) byDay[t.day] = t.count
    for (let i = 0; i < 7; i++) {
      chartData.push(byDay[String(i)] ?? 0)
      chartLabels.push(DAY_NAMES[i])
    }
  } else if (chartFilter === "month") {
    const byDay: Record<string, number> = {}
    for (const t of trends) if (t.day !== undefined) byDay[t.day] = t.count
    const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate()
    for (let i = 1; i <= daysInMonth; i++) {
      const key = String(i).padStart(2, "0")
      chartData.push(byDay[key] ?? 0)
      chartLabels.push(String(i))
    }
  } else {
    const byMonth: Record<string, number> = {}
    for (const t of trends) if (t.month !== undefined) byMonth[t.month] = t.count
    for (let i = 1; i <= 12; i++) {
      const key = String(i).padStart(2, "0")
      chartData.push(byMonth[key] ?? 0)
      chartLabels.push(MONTH_NAMES[i - 1])
    }
  }

  const chartMax = Math.max(...chartData, 1)

  const topUsers = leaderboard.slice(0, 3)

  return (
    <div>
      {/* ── Hero Card ── */}
      <div className="hero-card">
        <div className="hero-greeting">{greet}, {name} 🌱</div>
        <div className="hero-name">You recycled {weeklyItems} item{weeklyItems !== 1 ? "s" : ""} this week.</div>
        <div className="hero-sub" style={{ fontSize: 15, lineHeight: 1.6 }}>&ldquo;The greatest threat to our planet is the belief that someone else will save it.&rdquo;</div>
        <div className="hero-streak">♻️ {totalItemsRecycled} items recycled total</div>
      </div>

      {/* ── Tree Card ── */}
      <div className="card" style={{ marginBottom: 24, padding: "24px 0", textAlign: "center" }}>
        <TreeAnimation points={ecoPoints} />
        <p style={{ marginTop: 4, fontSize: 13, color: "var(--grey-500)" }}>
          {ecoPoints >= 700 ? "🌲 Fully Grown!"
            : ecoPoints >= 350 ? `🌳 ${700 - ecoPoints} pts to Fully Grown`
            : ecoPoints >= 150 ? `🌿 ${350 - ecoPoints} pts to Growing`
            : ecoPoints >= 50 ? `🌱 ${150 - ecoPoints} pts to Sapling`
            : `${50 - ecoPoints} pts to Sprout`}
        </p>
      </div>

      {/* ── Stats Grid ── */}
      <div className="grid-4" style={{ marginBottom: 24 }}>
        <div className="stat-card">
          <div className="stat-icon green">★</div>
          <div className="stat-value">{loading ? "..." : ecoPoints.toLocaleString()}</div>
          <div className="stat-label">EcoPoints</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon mint">◎</div>
          <div className="stat-value">{loading ? "..." : (ecoPoints * 2.5).toLocaleString()}</div>
          <div className="stat-label">Sustainability XP</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon blue">♻</div>
          <div className="stat-value">{loading ? "..." : co2Saved}</div>
          <div className="stat-label">CO₂ Saved (kg)</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">◎</div>
          <div className="stat-value">{loading ? "..." : wasteRecycled.toLocaleString()}</div>
          <div className="stat-label">Waste Recycled</div>
        </div>
      </div>

      {/* ── Quick Actions ── */}
      <div className="quick-actions">
        <button className="qaction" onClick={() => window.location.href = "/scan"}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
          Scan Waste
        </button>
        <button className="qaction" onClick={() => window.location.href = "/rewards"}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M8 12l2 2 4-4" /></svg>
          Redeem Rewards
        </button>
        <button className="qaction" onClick={() => window.location.href = "/leaderboard"}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>
          View Leaderboard
        </button>
        <button className="qaction" onClick={() => window.location.href = "/profile"}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
          My Profile
        </button>
      </div>

      {/* ── AI Scanner CTA ── */}
      <div className="scanner-cta" onClick={() => window.location.href = "/scan"}>
        <div className="scanner-cta-left">
          <div className="scan-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
          </div>
          <div>
            <h3>AI Waste Scanner</h3>
            <p>Point your camera to identify and sort waste instantly</p>
          </div>
        </div>
        <div className="scan-badge">Start Smart Scan</div>
      </div>

      {/* ── Real Activity Chart ── */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-header">
          <span className="card-title">Recycling Trends</span>
          <div className="filter-group">
            {(["week", "month", "year"] as const).map((f) => (
              <button key={f} className={`filter-btn${chartFilter === f ? " active" : ""}`} onClick={() => setChartFilter(f)}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <div className="chart">
          {chartData.map((v, i) => (
            <div key={i} className="chart-bar" title={`${chartLabels[i]}: ${v} scans`}>
              <div className="bar" style={{ height: `${(v / chartMax) * 100}%` }} />
              <div className="bar-value">{v}</div>
              <div className="bar-label">{chartLabels[i]}</div>
            </div>
          ))}
        </div>
        {trends.length === 0 && !loading && (
          <div style={{ textAlign: "center", padding: 8, fontSize: 13, color: "var(--grey-400)" }}>No scan data yet — start scanning to see your trends</div>
        )}
      </div>

      {/* ── Material Breakdown + Achievements ── */}
      <div className="grid-2" style={{ marginBottom: 24 }}>
        <div className="card">
          <div className="card-header">
            <span className="card-title">Material Breakdown</span>
          </div>
          {myBreakdown.length === 0 ? (
            <div style={{ padding: 16, textAlign: "center", color: "var(--grey-400)", fontSize: 13 }}>No scans yet</div>
          ) : (
            myBreakdown.map((b) => (
              <div key={b.material} className="activity-item">
                <div className={`activity-dot ${b.material === "Plastic" ? "green" : b.material === "Metal" ? "mint" : b.material === "Glass" ? "blue" : "green"}`} />
                <div className="activity-content">
                  <div className="activity-title">{b.material}</div>
                  <div className="activity-time">{b.count} scan{b.count !== 1 ? "s" : ""}</div>
                </div>
                <div className="activity-points">{b.count}</div>
              </div>
            ))
          )}
        </div>
        <div className="card">
          <div className="card-header">
            <span className="card-title">Achievements</span>
            <span className="card-link">{unlockedCount}/{achievements.length}</span>
          </div>
          <div className="badge-grid">
            {achievements.slice(0, 8).map((a) => (
              <div key={a.id} className={`badge-item${a.unlocked ? "" : " locked"}`}>
                <div className={`badge-icon${a.unlocked ? " unlocked" : " locked"}`}>{a.icon}</div>
                <div className="badge-name">{a.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Reward Marketplace Preview ── */}
      <div className="section-title">Reward Marketplace</div>
      <div className="reward-grid" style={{ marginBottom: 24 }}>
        {REWARDS.slice(0, 4).map((r) => (
          <div key={r.id} className="reward-card">
            <div style={{ fontSize: 28, marginBottom: 4 }}>{r.emoji}</div>
            <div className="reward-name" style={{ fontSize: 14 }}>{r.name}</div>
            <div className="reward-points"><strong>{r.cost}</strong> EcoPoints</div>
            <button className="reward-btn" onClick={() => window.location.href = "/rewards"}>Redeem Now</button>
          </div>
        ))}
      </div>

      {/* ── Leaderboard Preview ── */}
      <div className="flex-between" style={{ marginBottom: 16 }}>
        <span className="section-title" style={{ margin: 0 }}>Leaderboard</span>
        <span className="card-link" onClick={() => window.location.href = "/leaderboard"} style={{ cursor: "pointer" }}>View Full Leaderboard</span>
      </div>
      <div className="card" style={{ marginBottom: 24 }}>
        {loading
          ? <div style={{ padding: 20, textAlign: "center", color: "var(--grey-400)" }}>Loading...</div>
          : topUsers.length === 0
            ? <div style={{ padding: 20, textAlign: "center", color: "var(--grey-400)" }}>No recyclers yet</div>
            : topUsers.map((u, i) => {
                const rankClass = i === 0 ? "gold" : i === 1 ? "silver" : "bronze"
                const initials = (u.name || u.email || "?").charAt(0).toUpperCase()
                return (
                  <div key={u.id} className="lb-item">
                    <div className={`lb-rank ${rankClass}`}>{i + 1}</div>
                    <div className="lb-avatar">{initials}</div>
                    <div className="lb-info">
                      <div className="lb-name">{u.name || "Anonymous"}</div>
                      <div className="lb-points">{u.points} pts</div>
                    </div>
                    <div className="lb-stat">{u.points} pts</div>
                  </div>
                )
              })}
      </div>

      {/* ── Footer ── */}
      <div style={{ textAlign: "center", padding: "24px 0 12px", color: "var(--grey-400)", fontSize: 12 }}>
        EcoSort AI &copy; 2026 &bull; Making sustainability rewarding
      </div>
    </div>
  )
}
