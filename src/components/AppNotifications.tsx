"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"

interface NotificationItem {
  icon: string
  text: string
  time: string
}

export default function AppNotifications({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { data: session } = useSession()
  const [items, setItems] = useState<NotificationItem[]>([])

  useEffect(() => {
    if (!session?.user?.id) return
    fetch("/api/leaderboard")
      .then((r) => r.json())
      .then((data) => {
        const users = data.users ?? []
        const me = users.find((u: any) => u.id === session.user.id)
        const total = users.length
        const myRank = me ? users.findIndex((u: any) => u.id === me.id) + 1 : total
        const notifs: NotificationItem[] = []
        if ((me?.scans ?? 0) > 0) {
          notifs.push({ icon: "♻️", text: `You've recycled ${me.scans} items so far`, time: "All time" })
        }
        if (myRank <= 3 && total > 0) {
          notifs.push({ icon: "🏆", text: `You're #${myRank} on the leaderboard!`, time: "Current" })
        }
        if ((me?.points ?? 0) > 0) {
          const co2 = ((me?.scans ?? 0) * 0.4).toFixed(1)
          notifs.push({ icon: "🌍", text: `Your recycling saved ${co2}kg CO₂`, time: "All time" })
        }
        notifs.push({ icon: "🌱", text: "Keep scanning to earn more EcoPoints!", time: "" })
        setItems(notifs)
      })
      .catch(() => {})
  }, [session])

  return (
    <>
      <div className="overlay" style={{ display: open ? "block" : "none", zIndex: 199, cursor: "pointer" }} onClick={onClose} />
      <div className={`notif-panel${open ? " open" : ""}`}>
        <div className="notif-header">
          <h3>Notifications</h3>
          <button className="notif-close" onClick={onClose}>&times;</button>
        </div>
        <div className="notif-list" id="notifList">
          {items.length === 0 ? (
            <div style={{ padding: 20, textAlign: "center", color: "var(--grey-400)", fontSize: 14 }}>No notifications yet</div>
          ) : (
            items.map((n, i) => (
              <div key={i} className="notif-item">
                <div className="notif-icon">{n.icon}</div>
                <div>
                  <div className="notif-text">{n.text}</div>
                  {n.time && <div className="notif-time">{n.time}</div>}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  )
}
