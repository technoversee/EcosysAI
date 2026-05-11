"use client"

import { useEffect, useState } from "react"

export default function SplashScreen() {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const seen = sessionStorage.getItem("splash")
    if (seen) { setVisible(false); return }
    const t1 = setTimeout(() => setVisible(false), 2400)
    const t2 = setTimeout(() => sessionStorage.setItem("splash", "1"), 2800)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  if (!visible) return null

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-bg">
      {/* seed */}
      <div className="relative animate-float">
        <div className="absolute inset-0 rounded-full bg-primary/5 blur-3xl animate-breathe" />
        <svg viewBox="0 0 120 140" className="relative h-28 w-28">
          <ellipse cx="60" cy="130" rx="18" ry="5" fill="#c48a5a" opacity={0.15} />
          <ellipse cx="60" cy="126" rx="4" ry="5" fill="#8b7a6a" />
          <ellipse cx="60" cy="122" rx="6" ry="4" fill="#5a7d6b" opacity={0.85} />
          <ellipse cx="58" cy="119" rx="3.5" ry="3.5" fill="#7baf8a" />
        </svg>
      </div>

      <h1 className="mt-4 font-serif text-2xl font-semibold tracking-tight text-primary">
        EcosysAI
      </h1>
      <p className="mt-1 text-sm text-muted">Scan. Sort. Earn.</p>
    </div>
  )
}
