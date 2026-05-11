"use client"

import { useRouter } from "next/navigation"

const centers = [
  { name: "Greenway Recycling Center", addr: "123 Eco Street, Suite 100", dist: "0.8 mi", icon: "\ud83c\udfea" },
  { name: "E-Waste Collection Point", addr: "456 Green Avenue", dist: "1.2 mi", icon: "\u267b\ufe0f" },
  { name: "Waste Pickup Station", addr: "789 Sustainability Blvd", dist: "2.1 mi", icon: "\ud83d\udd04" },
]

export default function GuidancePage() {
  const router = useRouter()

  return (
    <div className="scanner-container">
      <div className="section-title" style={{ marginTop: 0 }}>Disposal Guidance</div>
      <div className="scan-result">
        <div className="result-item">
          <span className="result-label">Item</span>
          <span className="result-value">Plastic Bottle</span>
        </div>
        <div className="result-item">
          <span className="result-label">Category</span>
          <span className="result-value green">Recyclable</span>
        </div>
        <div className="result-item">
          <span className="result-label">Correct Bin</span>
          <span className="result-value">\ud83d\udd35 Blue Bin</span>
        </div>
      </div>
      <div className="card mb-24">
        <div className="card-title mb-12">Recycling Instructions</div>
        <div style={{ fontSize: 14, color: "var(--grey-600)", lineHeight: 1.7, textAlign: "left" }}>
          <p>1. Empty any remaining liquid from the bottle</p>
          <p>2. Remove the cap and place it separately</p>
          <p>3. Rinse briefly to remove residue</p>
          <p>4. Crush the bottle to save space</p>
          <p>5. Place in the <strong>Blue Recycling Bin</strong></p>
        </div>
      </div>
      <div className="card mb-24">
        <div className="card-title mb-12">Environmental Impact</div>
        <p style={{ fontSize: 14, color: "var(--grey-600)", lineHeight: 1.7, textAlign: "left" }}>
          Recycling one plastic bottle saves enough energy to power a 60W light bulb for 6
          hours. It also reduces CO<sub>2</sub> emissions by approximately 0.4kg and keeps
          plastic out of our oceans.
        </p>
      </div>
      <div className="card mb-24">
        <div className="card-title mb-12">Nearby Recycling Centers</div>
        {centers.map((c, i) => (
          <div className="center-card" key={i} onClick={() => router.push("/centers")}>
            <div className="center-icon">{c.icon}</div>
            <div className="center-info">
              <div className="center-name">{c.name}</div>
              <div className="center-addr">{c.addr}</div>
            </div>
            <div className="center-dist">{c.dist}</div>
          </div>
        ))}
      </div>
      <div className="scan-actions">
        <button className="btn-primary" onClick={() => router.push("/rewards")}>
          View Rewards
        </button>
        <button className="btn-secondary" onClick={() => router.push("/scan")}>
          Back to Scanner
        </button>
      </div>
    </div>
  )
}
