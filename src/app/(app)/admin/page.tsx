"use client"

const adminCards = [
  { value: "1,284", label: "Total Users", action: "View Users" },
  { value: "24", label: "Active Rewards", action: "Add Rewards" },
  { value: "18", label: "Partner Merchants", action: "Approve Merchants" },
  { value: "6.2K", label: "Items Segregated", action: "View Report" },
  { value: "3", label: "Active Campaigns", action: "Manage Campaigns" },
  { value: "92%", label: "Segregation Accuracy", action: "Generate Report" },
]

export default function AdminPage() {
  return (
    <>
      <div className="section-title" style={{ marginTop: 0 }}>Admin Dashboard</div>
      <p className="section-desc">Platform management and analytics overview.</p>
      <div className="admin-grid">
        {adminCards.map((card) => (
          <div key={card.label} className="admin-card">
            <div className="admin-stat">{card.value}</div>
            <div className="admin-label">{card.label}</div>
            <button className="admin-action">{card.action}</button>
          </div>
        ))}
      </div>
    </>
  )
}
