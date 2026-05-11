"use client"

import { useEffect, useState, useCallback } from "react"
import { useSession } from "next-auth/react"
import { REWARDS } from "@/lib/constants"

interface LeaderUser {
  id: string
  name: string
  email: string
  image: string
  points: number
  scans: number
}

interface ScanBreakdown {
  user_id: string
  material: string
  count: number
}

interface ActivityItem {
  title: string
  time: string
  points: string
  dot: string
}

interface Achievement {
  name: string
  icon: string
  unlocked: boolean
}

interface RewardPreview {
  brand: string
  name: string
  points: number
  desc: string
}

interface Center {
  name: string
  addr: string
  dist: string
  icon: string
}

function greeting(): string {
  const h = new Date().getHours()
  if (h < 12) return "Good Morning"
  if (h < 17) return "Good Afternoon"
  return "Good Evening"
}

const EMPTY_ACTIVITY: ActivityItem[] = [
  { title: "No activity yet", time: "Start scanning to see your activity", points: "", dot: "mint" },
]

const ACHIEVEMENTS: Achievement[] = [
  { name: "Plastic Warrior", icon: "\u267B", unlocked: true },
  { name: "Green Citizen", icon: "\uD83C\uDF31", unlocked: true },
  { name: "Eco Hero", icon: "\uD83C\uDFC6", unlocked: true },
  { name: "Waste Master", icon: "\uD83D\uDEE1", unlocked: false },
  { name: "Recycling Legend", icon: "\uD83C\uDF1F", unlocked: false },
  { name: "Carbon Crusher", icon: "\uD83C\uDF0D", unlocked: false },
]

const REWARD_PREVIEWS: RewardPreview[] = [
  { brand: "GreenBite Cafe", name: "Free Organic Coffee", points: 200, desc: "Enjoy a free organic coffee at GreenBite Cafe" },
  { brand: "EcoSip", name: "Eco Meal Discount", points: 350, desc: "15% off on all eco-friendly meals at EcoSip" },
]

const CENTERS: Center[] = [
  { name: "Greenway Recycling Center", addr: "123 Eco Street, Suite 100", dist: "0.8 mi", icon: "\u267B" },
  { name: "E-Waste Collection Point", addr: "456 Green Avenue", dist: "1.2 mi", icon: "\uD83D\uDDF3" },
  { name: "Waste Pickup Station", addr: "789 Sustainability Blvd", dist: "2.1 mi", icon: "\uD83D\uDEE1" },
]

function computeCo2(scans: number): string {
  return (scans * 0.4).toFixed(1)
}

export default function DashboardPage() {
  const { data: session } = useSession()
  const [leaderboard, setLeaderboard] = useState<LeaderUser[]>([])
  const [breakdown, setBreakdown] = useState<ScanBreakdown[]>([])
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

  const currentUser = leaderboard.find((u) => u.id === session?.user?.id)
  const userRank = currentUser ? leaderboard.findIndex((u) => u.id === currentUser.id) + 1 : 0
  const totalScans = currentUser?.scans ?? 0
  const ecoPoints = currentUser?.points ?? 0
  const co2Saved = computeCo2(totalScans)
  const wasteRecycled = totalScans

  const totalItemsRecycled = leaderboard.reduce((sum, u) => sum + u.scans, 0)
  const myBreakdown = breakdown.filter((b) => b.user_id === session?.user?.id)
  const weeklyItems = myBreakdown.reduce((sum, b) => sum + b.count, 0) || Math.min(totalScans, 24)

  const greet = greeting()
  const name = session?.user?.name || "User"

  // Chart data depends on filter
  const baseData = [30, 45, 22, 58, 41, 63, 37]
  const chartData =
    chartFilter === "week"
      ? baseData
      : baseData.map((v) => Math.floor(v * (0.7 + Math.random() * 0.6)))
  const chartMax = Math.max(...chartData)
  const chartLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

  const topUsers = leaderboard.slice(0, 3)

  return (
    <div>
      {/* ── Hero Card ── */}
      <div className="hero-card">
        <div className="hero-greeting">
          {greet}, {name} &#127793;
        </div>
        <div className="hero-name">
          You recycled {weeklyItems} item{weeklyItems !== 1 ? "s" : ""} this week.
        </div>
        <div className="hero-sub">
          &ldquo;The greatest threat to our planet is the belief that someone else will save it.&rdquo;
        </div>
        <div className="hero-streak">
          &#127793; {totalItemsRecycled} items recycled
        </div>
      </div>

      {/* ── Stats Grid ── */}
      <div className="grid-4" style={{ marginBottom: 24 }}>
        <div className="stat-card">
          <div className="stat-icon green">&#9733;</div>
          <div className="stat-value">
            {loading ? "..." : ecoPoints.toLocaleString()}
          </div>
          <div className="stat-label">EcoPoints</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon mint">&#9850;</div>
          <div className="stat-value">
            {loading ? "..." : (ecoPoints * 2.5).toLocaleString()}
          </div>
          <div className="stat-label">Sustainability XP</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon blue">&#9851;</div>
          <div className="stat-value">
            {loading ? "..." : co2Saved}
          </div>
          <div className="stat-label">CO&#8322; Saved (kg)</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">&#9850;</div>
          <div className="stat-value">
            {loading ? "..." : wasteRecycled.toLocaleString()}
          </div>
          <div className="stat-label">Waste Recycled</div>
        </div>
      </div>

      {/* ── Quick Actions ── */}
      <div className="quick-actions">
        <button className="qaction" onClick={() => window.location.href = "/scan"}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          Scan Waste
        </button>
        <button className="qaction" onClick={() => window.location.href = "/rewards"}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M8 12l2 2 4-4" />
          </svg>
          Redeem Rewards
        </button>
        <button className="qaction" onClick={() => window.location.href = "/leaderboard"}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="20" x2="18" y2="10" />
            <line x1="12" y1="20" x2="12" y2="4" />
            <line x1="6" y1="20" x2="6" y2="14" />
          </svg>
          View Analytics
        </button>
        <button className="qaction" onClick={() => window.location.href = "/leaderboard"}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          Find Centers
        </button>
      </div>

      {/* ── AI Scanner CTA ── */}
      <div className="scanner-cta" onClick={() => window.location.href = "/scan"}>
        <div className="scanner-cta-left">
          <div className="scan-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </div>
          <div>
            <h3>AI Waste Scanner</h3>
            <p>Point your camera to identify and sort waste instantly</p>
          </div>
        </div>
        <div className="scan-badge">Start Smart Scan</div>
      </div>

      {/* ── Weekly Activity Chart ── */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-header">
          <span className="card-title">Weekly Activity</span>
          <div className="filter-group">
            {(["week", "month", "year"] as const).map((f) => (
              <button
                key={f}
                className={`filter-btn${chartFilter === f ? " active" : ""}`}
                onClick={() => setChartFilter(f)}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <div className="chart">
          {chartData.map((v, i) => (
            <div key={i} className="chart-bar">
              <div className="bar" style={{ height: `${(v / chartMax) * 100}%` }} />
              <div className="bar-value">{v}</div>
              <div className="bar-label">{chartLabels[i]}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Recent Activity + Achievements ── */}
      <div className="grid-2" style={{ marginBottom: 24 }}>
        <div className="card">
          <div className="card-header">
            <span className="card-title">Recent Activity</span>
            <span className="card-link">View All</span>
          </div>
          {EMPTY_ACTIVITY.map((a, i) => (
            <div key={i} className="activity-item">
              <div className={`activity-dot ${a.dot}`} />
              <div className="activity-content">
                <div className="activity-title">{a.title}</div>
                <div className="activity-time">{a.time}</div>
              </div>
              <div className="activity-points">{a.points}</div>
            </div>
          ))}
        </div>
        <div className="card">
          <div className="card-header">
            <span className="card-title">Achievements</span>
            <span className="card-link">View All</span>
          </div>
          <div className="badge-grid">
            {ACHIEVEMENTS.map((a) => (
              <div key={a.name} className={`badge-item${a.unlocked ? "" : " locked"}`}>
                <div className={`badge-icon${a.unlocked ? " unlocked" : " locked"}`}>
                  {a.icon}
                </div>
                <div className="badge-name">{a.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Reward Marketplace ── */}
      <div className="section-title">Reward Marketplace</div>
      <div className="reward-grid" style={{ marginBottom: 24 }}>
        {REWARD_PREVIEWS.map((r, i) => (
          <div key={i} className="reward-card">
            <div className="reward-brand">{r.brand}</div>
            <div className="reward-name">{r.name}</div>
            <div className="reward-points">
              <strong>{r.points}</strong> EcoPoints
            </div>
            <button className="reward-btn" onClick={() => window.location.href = "/rewards"}>
              Redeem Now
            </button>
          </div>
        ))}
      </div>

      {/* ── Leaderboard Preview ── */}
      <div className="flex-between" style={{ marginBottom: 16 }}>
        <span className="section-title" style={{ margin: 0 }}>Leaderboard</span>
        <span
          className="card-link"
          onClick={() => window.location.href = "/leaderboard"}
          style={{ cursor: "pointer" }}
        >
          View Full Leaderboard
        </span>
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

      {/* ── Nearby Recycling Centers ── */}
      <div className="section-title">Nearby Recycling Centers</div>
      {CENTERS.slice(0, 2).map((c, i) => (
        <div key={i} className="center-card" onClick={() => window.location.href = "/leaderboard"}>
          <div className="center-icon">{c.icon}</div>
          <div className="center-info">
            <div className="center-name">{c.name}</div>
            <div className="center-addr">{c.addr}</div>
          </div>
          <div className="center-dist">{c.dist}</div>
        </div>
      ))}
      <div className="flex-between" style={{ marginTop: 12 }}>
        <span />
        <span
          className="card-link"
          onClick={() => window.location.href = "/leaderboard"}
          style={{ cursor: "pointer" }}
        >
          Open Full Map
        </span>
      </div>

      {/* ── Footer ── */}
      <div
        style={{
          textAlign: "center",
          padding: "24px 0 12px",
          color: "var(--grey-400)",
          fontSize: 12,
        }}
      >
        EcoSort AI &copy; 2026 &bull; Making sustainability rewarding
      </div>
    </div>
  )
}
