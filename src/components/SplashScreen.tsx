"use client"

import { useEffect, useState } from "react"

export default function SplashScreen() {
  const [phase, setPhase] = useState<"enter" | "show" | "exit" | "gone">("enter")

  useEffect(() => {
    const seen = sessionStorage.getItem("ecosysai_splash_seen")
    if (seen) {
      setPhase("gone")
      return
    }

    const enterTimer = setTimeout(() => setPhase("show"), 80)
    const exitTimer = setTimeout(() => setPhase("exit"), 2200)
    const removeTimer = setTimeout(() => {
      setPhase("gone")
      sessionStorage.setItem("ecosysai_splash_seen", "true")
    }, 2800)

    return () => {
      clearTimeout(enterTimer)
      clearTimeout(exitTimer)
      clearTimeout(removeTimer)
    }
  }, [])

  if (phase === "gone") return null

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#f4ede4] transition-all duration-700 ${
        phase === "enter"
          ? "opacity-0"
          : phase === "exit"
            ? "opacity-0 scale-105"
            : "opacity-100"
      }`}
    >
      {/* Tree */}
      <div className="relative animate-float">
        <div className="absolute inset-0 rounded-full bg-[#2f4b3c]/5 blur-3xl animate-breathe" />
        <svg viewBox="0 0 120 140" className="relative h-32 w-32 drop-shadow-lg">
          <ellipse cx="60" cy="130" rx="20" ry="6" fill="#C48A5A" opacity={0.15} />
          <ellipse cx="60" cy="125" rx="5" ry="6" fill="#8B7A6A" />
          <ellipse cx="60" cy="121" rx="7" ry="5" fill="#4A7C5F" opacity={0.85} />
          <ellipse cx="58" cy="118" rx="4" ry="4" fill="#6B8F7C" />
        </svg>
      </div>

      {/* Brand */}
      <h1
        className={`mt-5 font-serif text-3xl font-semibold tracking-tight text-[#2f4b3c] transition-all duration-700 delay-200 ${
          phase === "show" ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        EcosysAI
      </h1>
      <p
        className={`mt-2 text-sm tracking-wide text-[#8c7c6e] transition-all duration-700 delay-300 ${
          phase === "show" ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        Scan. Sort. Earn.
      </p>

      {/* Loading dots */}
      <div className="mt-10 flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-1.5 w-1.5 rounded-full bg-[#2f4b3c] transition-all duration-500"
            style={{
              opacity: phase === "show" ? 0.4 : 0,
              animationDelay: `${i * 200}ms`,
              animation: phase === "show" ? `pulse 1.2s ease-in-out ${i * 200}ms infinite` : "none",
            }}
          />
        ))}
      </div>
    </div>
  )
}
