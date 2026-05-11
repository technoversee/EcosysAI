"use client"

import { useEffect, useState } from "react"
import { useSession, signOut } from "next-auth/react"
import TreeAnimation from "@/components/TreeAnimation"

interface LeaderUser {
  id: string
  name: string
  email: string
  points: number
  scans: number
}

const achievements = [
  { name: "Plastic Warrior", unlocked: true },
  { name: "Green Citizen", unlocked: true },
  { name: "Eco Hero", unlocked: true },
  { name: "Waste Master", unlocked: false },
  { name: "Recycling Legend", unlocked: false },
  { name: "Carbon Crusher", unlocked: false },
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
  const { data: session } = useSession()
  const [users, setUsers] = useState<LeaderUser[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/leaderboard")
      .then((r) => r.json())
      .then((data) => { setUsers(data.users || []) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const myUser = users.find((u) => u.id === session?.user?.id)
  const myRank = myUser ? users.findIndex((u) => u.id === myUser.id) + 1 : users.length + 1
  const points = myUser?.points || 0
  const scans = myUser?.scans || 0
  const xp = Math.floor(points * 2.5)

  // Derived activity from real scan data
  const activityItems = scans > 0
    ? [
        { title: `${scans} item${scans > 1 ? "s" : ""} recycled`, time: "All time", points: `+${points}`, dot: "green" as const },
        { title: `Rank #${myRank} on leaderboard`, time: "Current", points: `${xp} XP`, dot: "mint" as const },
      ]
    : [{ title: "No scans yet", time: "Start scanning!", points: "", dot: "mint" as const }]

  const name = session?.user?.name || "User"
  const email = session?.user?.email || "user@ecosys.ai"

  return (
    <>
      <div className="profile-header" style={{ paddingTop: 0 }}>
        <div className="profile-avatar">{getInitials(name)}</div>
        <div className="profile-name">{name}</div>
        <div className="profile-email">{email}</div>
      </div>

      {/* Tree + Stats */}
      <div className="card" style={{ padding: "16px 0", marginBottom: 16, textAlign: "center" }}>
        <TreeAnimation points={points} />
      </div>

      <div className="profile-stats" style={{ marginBottom: 16 }}>
        <div className="profile-stat">
          <div className="ps-value">{loading ? "..." : points}</div>
          <div className="ps-label">EcoPoints</div>
        </div>
        <div className="profile-stat">
          <div className="ps-value">{loading ? "..." : xp}</div>
          <div className="ps-label">XP</div>
        </div>
        <div className="profile-stat">
          <div className="ps-value">{loading ? "..." : `#${myRank}`}</div>
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
        {activityItems.map((a) => (
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
        onClick={() => signOut({ callbackUrl: "/" })}
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
