"use client"

import { useEffect, useState } from "react"
import { WASTE_FACTS } from "@/lib/constants"

export default function NotificationBanner() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % WASTE_FACTS.length)
    }, 8000)
    return () => clearInterval(id)
  }, [])

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 8,
      padding: "8px 16px", fontSize: 13, lineHeight: 1.4,
      color: "var(--emerald)",
    }}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
        <path d="M11 20A7 7 0 0 1 9.8 6.9C15.5 4.9 17 3.5 19 2c1 2 2 4.5 2 8 0 5.5-4.78 10-10 10Z" />
        <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
      </svg>
      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        {WASTE_FACTS[index]}
      </span>
    </div>
  )
}
