"use client"

import { useEffect } from "react"
import { useSession, signOut } from "next-auth/react"

function useCounterAnimation() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement
            const target = parseInt(el.dataset.target || "0", 10)
            const duration = 1200
            const start = performance.now()
            function update(now: number) {
              const elapsed = now - start
              const progress = Math.min(elapsed / duration, 1)
              const eased = 1 - Math.pow(1 - progress, 3)
              el.textContent = Math.floor(eased * target).toLocaleString()
              if (progress < 1) requestAnimationFrame(update)
            }
            requestAnimationFrame(update)
            observer.unobserve(el)
          }
        }
      },
      { threshold: 0.5 }
    )
    document.querySelectorAll(".counter").forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])
}

const achievements = [
  { name: "Plastic Warrior", unlocked: true },
  { name: "Green Citizen", unlocked: true },
  { name: "Eco Hero", unlocked: true },
  { name: "Waste Master", unlocked: false },
  { name: "Recycling Legend", unlocked: false },
  { name: "Carbon Crusher", unlocked: false },
]

const recentActivity = [
  { title: "Scanned Plastic Bottle", time: "2 min ago", points: "+15", dot: "green" as const },
  { title: "Eco Hero Badge Unlocked", time: "1 hour ago", points: "+100 XP", dot: "mint" as const },
  { title: "Redeemed Free Coffee Coupon", time: "3 hours ago", points: "-200", dot: "orange" as const },
  { title: "Scanned Aluminum Can", time: "5 hours ago", points: "+10", dot: "green" as const },
]

const savedRewards = [
  { brand: "GreenBite Cafe", name: "Free Organic Coffee", points: 200 },
  { brand: "EcoSip", name: "Eco Meal Discount", points: 350 },
]

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/)
  return parts.length > 1 ? (parts[0][0] + parts[1][0]).toUpperCase() : parts[0][0].toUpperCase()
}

export default function ProfilePage() {
  useCounterAnimation()
  const { data: session } = useSession()

  const name = session?.user?.name || "User"
  const email = session?.user?.email || "user@ecosys.ai"

  return (
    <>
      <div className="profile-header" style={{ paddingTop: 0 }}>
        <div className="profile-avatar">{getInitials(name)}</div>
        <div className="profile-name">{name}</div>
        <div className="profile-email">{email}</div>
      </div>

      <div className="profile-stats">
        <div className="profile-stat">
          <div className="ps-value"><span className="counter" data-target="1240">0</span></div>
          <div className="ps-label">EcoPoints</div>
        </div>
        <div className="profile-stat">
          <div className="ps-value"><span className="counter" data-target="3450">0</span></div>
          <div className="ps-label">XP</div>
        </div>
        <div className="profile-stat">
          <div className="ps-value">#3</div>
          <div className="ps-label">Rank</div>
        </div>
      </div>

      <div className="profile-section">
        <h3>Badges &amp; Achievements</h3>
        <div className="badge-grid">
          {achievements.map((a) => (
            <div key={a.name} className={`badge-item ${a.unlocked ? "" : "locked"}`}>
              <div className={`badge-icon ${a.unlocked ? "unlocked" : "locked"}`}>
                {a.unlocked ? "\uD83C\uDFC6" : "\uD83D\uDD12"}
              </div>
              <div className="badge-name">{a.name}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="profile-section">
        <h3>Recent Activity</h3>
        {recentActivity.map((a) => (
          <div key={a.title + a.time} className="activity-item">
            <div className={`activity-dot ${a.dot}`} />
            <div className="activity-content">
              <div className="activity-title">{a.title}</div>
              <div className="activity-time">{a.time}</div>
            </div>
            <div className="activity-points">{a.points}</div>
          </div>
        ))}
      </div>

      <div className="profile-section">
        <h3>Saved Rewards</h3>
        <div className="reward-grid">
          {savedRewards.map((r) => (
            <div key={r.name} className="reward-card">
              <div className="reward-brand">{r.brand}</div>
              <div className="reward-name">{r.name}</div>
              <div className="reward-points"><strong>{r.points}</strong> EcoPoints</div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={() => {
          localStorage.removeItem("ecosort-token")
          localStorage.removeItem("ecosort-user")
          signOut({ callbackUrl: "/" })
        }}
        style={{
          width: "100%", marginTop: 20, padding: 14,
          border: "1.5px solid var(--grey-200)", borderRadius: 10,
          background: "transparent", fontSize: 14, fontWeight: 500,
          fontFamily: "inherit", color: "var(--grey-500)", cursor: "pointer",
        }}
      >
        Logout
      </button>
    </>
  )
}
