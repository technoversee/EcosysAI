"use client"

import { useEffect } from "react"

function useCounterAnimation() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement
            const target = parseFloat(el.dataset.target || "0")
            const suffix = el.dataset.suffix || ""
            const decimals = parseInt(el.dataset.decimals || "0")
            const duration = 2000
            const start = performance.now()
            function update(now: number) {
              const elapsed = now - start
              const progress = Math.min(elapsed / duration, 1)
              const eased = 1 - Math.pow(1 - progress, 3)
              el.textContent = (eased * target).toFixed(decimals) + suffix
              if (progress < 1) requestAnimationFrame(update)
            }
            requestAnimationFrame(update)
            observer.unobserve(el)
          }
        }
      },
      { threshold: 0.3 }
    )
    document.querySelectorAll(".counter").forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])
}

const activityData = [30, 45, 22, 58, 41, 63, 37]
const activityDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
const maxVal = Math.max(...activityData)

const wasteCategories = [
  { label: "Plastic", pct: 35, color: "var(--emerald)" },
  { label: "Paper", pct: 25, color: "var(--mint)" },
  { label: "Glass", pct: 18, color: "var(--aqua)" },
  { label: "Metal", pct: 12, color: "var(--sage)" },
  { label: "E-Waste", pct: 10, color: "var(--grey-400)" },
]

const tips = [
  { icon: "\uD83D\uDCA1", text: "Your recycling pattern shows peak activity on Fridays. Consider scheduling pickups accordingly." },
  { icon: "\uD83C\uDF31", text: "You've saved enough CO\u2082 this month to power a home for 3 days." },
  { icon: "\uD83C\uDFC6", text: "You're in the top 10% of recyclers in your area. Keep it up!" },
]

export default function AnalyticsPage() {
  useCounterAnimation()

  return (
    <>
      <div className="section-title" style={{ marginTop: 0 }}>Analytics Dashboard</div>
      <p className="section-desc">Track your sustainability impact and recycling performance over time.</p>

      <div className="grid-4 mb-24">
        <div className="stat-card">
          <div className="stat-icon green">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
          </div>
          <div className="stat-value"><span className="counter" data-target="1284" data-suffix=" kg">0</span></div>
          <div className="stat-label">Total Waste Recycled</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon mint">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" /><path d="M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20z" />
            </svg>
          </div>
          <div className="stat-value"><span className="counter" data-target="47.2" data-decimals="1" data-suffix=" kg">0</span></div>
          <div className="stat-label">CO\u2082 Reduction</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon blue">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <div className="stat-value">92%</div>
          <div className="stat-label">Accuracy Rate</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
          </div>
          <div className="stat-value"><span className="counter" data-target="7">0</span></div>
          <div className="stat-label">Day Streak</div>
        </div>
      </div>

      <div className="card mb-24">
        <div className="card-header">
          <span className="card-title">Weekly Recycling Trend</span>
        </div>
        <div className="chart">
          {activityData.map((v, i) => (
            <div key={activityDays[i]} className="chart-bar">
              <div className="bar" style={{ height: `${(v / maxVal) * 100}%` }} />
              <div className="bar-value">{v}</div>
              <div className="bar-label">{activityDays[i]}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid-2 mb-24">
        <div className="card">
          <div className="card-title mb-12">Waste Category Breakdown</div>
          <div style={{ padding: "8px 0" }}>
            {wasteCategories.map((w) => (
              <div key={w.label} style={{ display: "flex", alignItems: "center", gap: 12, padding: "6px 0" }}>
                <span style={{ width: 60, fontSize: 13, color: "var(--grey-500)" }}>{w.label}</span>
                <div style={{ flex: 1, height: 8, borderRadius: 4, background: "var(--grey-200)" }}>
                  <div style={{ height: "100%", borderRadius: 4, width: `${w.pct}%`, background: w.color, transition: "width 1s" }} />
                </div>
                <span style={{ fontSize: 13, fontWeight: 600, color: "var(--grey-700)", width: 40, textAlign: "right" }}>{w.pct}%</span>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <div className="card-title mb-12">AI Sustainability Insights</div>
          <div style={{ fontSize: 14, color: "var(--grey-600)", lineHeight: 1.7 }}>
            {tips.map((tip, i) => (
              <p key={i} style={{ marginBottom: i < tips.length - 1 ? 12 : 0 }}>
                {tip.icon} {tip.text}
              </p>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-between">
        <span />
        <button
          onClick={() => {/* export logic */}}
          style={{
            padding: "10px 24px", borderRadius: 10, border: "1px solid var(--grey-200)",
            background: "var(--glass)", fontSize: 14, fontWeight: 500,
            fontFamily: "inherit", color: "var(--grey-600)", cursor: "pointer",
          }}
        >
          Export Report
        </button>
      </div>
    </>
  )
}
