"use client"

import { useEffect, useState } from "react"

interface AdminCard {
  value: string
  label: string
  action: string
}

export default function AdminPage() {
  const [cards, setCards] = useState<AdminCard[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch("/api/proofs").then((r) => r.json()),
      fetch("/api/leaderboard").then((r) => r.json()),
    ])
      .then(([proofsData, leaderData]) => {
        const proofCount = proofsData.proofs?.length ?? 0
        const users = leaderData.users ?? []
        const totalUsers = users.length
        const totalScans = users.reduce((sum: number, u: any) => sum + u.scans, 0)

        setCards([
          { value: totalUsers.toLocaleString(), label: "Total Users", action: "View Users" },
          { value: "24", label: "Active Rewards", action: "Add Rewards" },
          { value: "18", label: "Partner Merchants", action: "Approve Merchants" },
          { value: totalScans.toLocaleString(), label: "Items Segregated", action: "View Report" },
          { value: proofCount.toLocaleString(), label: "Total Proofs", action: "Review Proofs" },
          { value: "3", label: "Active Campaigns", action: "Manage Campaigns" },
          { value: "92%", label: "Segregation Accuracy", action: "Generate Report" },
        ])
      })
      .catch(() => {
        setCards([
          { value: "—", label: "Total Users", action: "View Users" },
          { value: "24", label: "Active Rewards", action: "Add Rewards" },
          { value: "18", label: "Partner Merchants", action: "Approve Merchants" },
          { value: "—", label: "Items Segregated", action: "View Report" },
          { value: "—", label: "Total Proofs", action: "Review Proofs" },
          { value: "3", label: "Active Campaigns", action: "Manage Campaigns" },
          { value: "92%", label: "Segregation Accuracy", action: "Generate Report" },
        ])
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      <div className="section-title" style={{ marginTop: 0 }}>Admin Dashboard</div>
      <p className="section-desc">Platform management and analytics overview.</p>
      {loading ? (
        <div style={{ padding: 40, textAlign: "center", color: "var(--grey-400)" }}>Loading...</div>
      ) : (
        <div className="admin-grid">
          {cards.map((card) => (
            <div key={card.label} className="admin-card">
              <div className="admin-stat">{card.value}</div>
              <div className="admin-label">{card.label}</div>
              <button className="admin-action">{card.action}</button>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
