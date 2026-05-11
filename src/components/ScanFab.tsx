"use client"

import { useRouter } from "next/navigation"

export default function ScanFab() {
  const router = useRouter()

  return (
    <button className="scan-fab" onClick={() => router.push("/scan")} aria-label="Scan Waste">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    </button>
  )
}
