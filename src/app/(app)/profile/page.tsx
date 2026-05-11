"use client"

import { useEffect, useState } from "react"
import { useSession, signOut } from "next-auth/react"
import TreeAnimation from "@/components/TreeAnimation"
import { ACHIEVEMENTS } from "@/lib/constants"

interface LeaderUser {
  id: string; name: string; email: string; points: number; scans: number
}

interface ScanBreakdown {
  user_id: string; material: string; count: number
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/)
  return parts.length > 1 ? (parts[0][0] + parts[1][0]).toUpperCase() : parts[0][0].toUpperCase()
}

export default function ProfilePage() {
  const { data: session } = useSession()
  const [users, setUsers] = useState<LeaderUser[]>([])
  const [breakdown, setBreakdown] = useState<ScanBreakdown[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch("/api/leaderboard").then((r) => r.json()),
    ]).then(([data]) => {
      setUsers(data.users || [])
      setBreakdown(data.breakdown || [])
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const myUser = users.find((u) => u.id === session?.user?.id)
  const myRank = myUser ? users.findIndex((u) => u.id === myUser.id) + 1 : users.length + 1
  const points = myUser?.points || 0
  const scans = myUser?.scans || 0
  const xp = Math.floor(points * 2.5)

  const myBreakdown = breakdown.filter((b) => b.user_id === session?.user?.id)
  const materialCounts: Record<string, number> = {}
  for (const b of myBreakdown) materialCounts[b.material] = (materialCounts[b.material] || 0) + b.count

  const achievements = ACHIEVEMENTS.map((a) => ({
    id: a.id, name: a.name, desc: a.desc, icon: a.icon,
    unlocked: a.check(scans, points, materialCounts),
  }))
  const unlockedCount = achievements.filter((a) => a.unlocked).length

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

      <div className="card" style={{ padding: "16px 0", marginBottom: 16, textAlign: "center" }}>
        <TreeAnimation points={points} />
      </div>

      <div className="profile-stats" style={{ marginBottom: 16 }}>
        <div className="profile-stat"><div className="ps-value">{loading ? "..." : points}</div><div className="ps-label">EcoPoints</div></div>
        <div className="profile-stat"><div className="ps-value">{loading ? "..." : xp}</div><div className="ps-label">XP</div></div>
        <div className="profile-stat"><div className="ps-value">{loading ? "..." : `#${myRank}`}</div><div className="ps-label">Rank</div></div>
        <div className="profile-stat"><div className="ps-value">{loading ? "..." : scans}</div><div className="ps-label">Scans</div></div>
      </div>

      <div className="profile-section">
        <h3>Achievements <span style={{ fontSize: 13, fontWeight: 400, color: "var(--grey-400)" }}>({unlockedCount}/{achievements.length})</span></h3>
        <div className="badge-grid" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
          {achievements.map((a) => (
            <div key={a.id} className={`badge-item ${a.unlocked ? "" : "locked"}`} title={a.desc}>
              <div className={`badge-icon ${a.unlocked ? "unlocked" : "locked"}`} style={{ fontSize: 22 }}>{a.icon}</div>
              <div className="badge-name" style={{ fontSize: 10 }}>{a.name}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="profile-section">
        <h3>Material Breakdown</h3>
        {myBreakdown.length === 0 ? (
          <div style={{ color: "var(--grey-400)", fontSize: 13, padding: 8 }}>No scans yet</div>
        ) : (
          myBreakdown.map((b) => (
            <div key={b.material} className="activity-item">
              <div className={`activity-dot ${b.material === "Plastic" ? "green" : "mint"}`} />
              <div className="activity-content">
                <div className="activity-title">{b.material}</div>
                <div className="activity-time">{b.count} scan{b.count !== 1 ? "s" : ""}</div>
              </div>
              <div className="activity-points">{b.count}</div>
            </div>
          ))
        )}
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

      <button onClick={() => signOut({ callbackUrl: "/" })} style={{ width: "100%", marginTop: 20, padding: 14, border: "1.5px solid var(--grey-200)", borderRadius: 10, background: "transparent", fontSize: 14, fontWeight: 500, fontFamily: "inherit", color: "var(--grey-500)", cursor: "pointer" }}>
        Logout
      </button>
    </>
  )
}
