"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"

interface LeaderboardUser {
  id: string
  name: string
  email: string
  image: string
  points: number
  scans: number
}

export default function LeaderboardPage() {
  const { data: session } = useSession()
  const [users, setUsers] = useState<LeaderboardUser[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/leaderboard")
      .then((r) => r.json())
      .then((data) => {
        setUsers(data.users || [])
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const myIndex = users.findIndex((u) => u.id === session?.user?.id)
  const myRank = myIndex === -1 ? users.length + 1 : myIndex + 1
  const myUser = users.find((u) => u.id === session?.user?.id)

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((p) => p[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "?"

  return (
    <>
      <div className="section-title" style={{ marginTop: 0 }}>
        Leaderboard
      </div>
      <p className="section-desc">
        Compete with your community. Top recyclers earn exclusive badges and rewards.
      </p>

      {loading ? (
        <div className="card mb-24" style={{ textAlign: "center", padding: 40, color: "var(--grey-400)" }}>
          Loading leaderboard...
        </div>
      ) : (
        <>
          <div
            className="card mb-24"
            style={{
              background: "linear-gradient(135deg,var(--emerald),var(--emerald-light))",
              color: "#fff",
              textAlign: "center",
              padding: 20,
            }}
          >
            <div style={{ fontSize: 14, opacity: 0.85 }}>Your Ranking</div>
            <div style={{ fontSize: 36, fontWeight: 800, margin: "4px 0" }}>#{myRank}</div>
            <div style={{ fontSize: 13, opacity: 0.75 }}>
              {myUser?.points ?? 0} EcoPoints &bull; {myUser?.scans ?? 0} scans
            </div>
          </div>

          <div className="card">
            {users.map((u, i) => {
              const isMe = u.id === session?.user?.id
              const rankClass =
                i === 0 ? "gold" : i === 1 ? "silver" : i === 2 ? "bronze" : "default"
              return (
                <div
                  className="lb-item"
                  key={u.id}
                  style={
                    isMe
                      ? {
                          background: "rgba(45,106,79,0.06)",
                          borderRadius: 8,
                          padding: "10px 8px",
                          borderBottom: "1px solid var(--grey-200)",
                        }
                      : {}
                  }
                >
                  <div className={`lb-rank ${rankClass}`}>{i + 1}</div>
                  <div
                    className="lb-avatar"
                    style={
                      isMe
                        ? {
                            background: "linear-gradient(135deg,var(--emerald),var(--mint))",
                            color: "#fff",
                          }
                        : {}
                    }
                  >
                    {u.image
                      ? <img src={u.image} alt="" style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} />
                      : getInitials(u.name)
                    }
                  </div>
                  <div className="lb-info">
                    <div className="lb-name">
                      {u.name}
                      {isMe && (
                        <span style={{ color: "var(--emerald)", fontSize: 12, marginLeft: 6 }}>
                          (You)
                        </span>
                      )}
                    </div>
                    <div className="lb-points">{u.points} pts &bull; {u.scans} scans</div>
                  </div>
                  <div className="lb-stat">{u.points} pts</div>
                </div>
              )
            })}
          </div>
        </>
      )}

      <div className="scan-actions mt-12">
        <button
          className="btn-primary"
          style={{ flex: 1, padding: 14 }}
          onClick={() => alert("Challenge joined! Complete a 14-day recycling streak.")}
        >
          Join Weekly Challenge
        </button>
        <button
          className="btn-secondary"
          style={{ flex: 1, padding: 14 }}
          onClick={() => {
            const text = `I'm ranked #${myRank} on EcosysAI with ${myUser?.points ?? 0} EcoPoints! Join me at`
            if (navigator.share) {
              navigator.share({ title: "EcosysAI Leaderboard", text })
            } else {
              navigator.clipboard.writeText(text).then(() => alert("Rank copied to clipboard!"))
            }
          }}
        >
          Share Rank
        </button>
      </div>
    </>
  )
}
