"use client"

import { useEffect, useState, useRef } from "react"

const TREES = [
  <svg key={0} viewBox="0 0 120 140" style={{ width: 144, height: 144 }}>
    <ellipse cx="60" cy="120" rx="18" ry="6" fill="#8B5A2B" opacity={0.3} />
    <ellipse cx="60" cy="115" rx="4" ry="5" fill="#8B5A2B" />
    <ellipse cx="60" cy="111" rx="6" ry="4" fill="#52B788" opacity={0.8} />
    <ellipse cx="58" cy="108" rx="3" ry="3" fill="#95D5B2" />
  </svg>,
  <svg key={1} viewBox="0 0 120 140" style={{ width: 144, height: 144 }}>
    <ellipse cx="60" cy="130" rx="22" ry="6" fill="#8B5A2B" opacity={0.3} />
    <rect x="57" y="80" width="6" height="45" rx="3" fill="#8B5A2B" />
    <ellipse cx="60" cy="80" rx="14" ry="12" fill="#52B788" />
    <ellipse cx="54" cy="76" rx="8" ry="6" fill="#95D5B2" />
  </svg>,
  <svg key={2} viewBox="0 0 120 140" style={{ width: 144, height: 144 }}>
    <ellipse cx="60" cy="135" rx="28" ry="7" fill="#8B5A2B" opacity={0.3} />
    <rect x="56" y="65" width="8" height="65" rx="4" fill="#A98467" />
    <ellipse cx="60" cy="62" rx="22" ry="18" fill="#2D6A4F" />
    <ellipse cx="54" cy="58" rx="14" ry="10" fill="#52B788" />
    <ellipse cx="66" cy="52" rx="8" ry="6" fill="#95D5B2" />
  </svg>,
  <svg key={3} viewBox="0 0 120 140" style={{ width: 144, height: 144 }}>
    <ellipse cx="60" cy="135" rx="32" ry="8" fill="#8B5A2B" opacity={0.3} />
    <rect x="54" y="50" width="12" height="80" rx="5" fill="#A98467" />
    <ellipse cx="60" cy="45" rx="30" ry="22" fill="#2D6A4F" />
    <ellipse cx="50" cy="40" rx="18" ry="14" fill="#52B788" />
    <ellipse cx="70" cy="34" rx="12" ry="10" fill="#95D5B2" />
    <circle cx="45" cy="48" r="3" fill="#E9C46A" />
    <circle cx="70" cy="38" r="2.5" fill="#E9C46A" />
  </svg>,
  <svg key={4} viewBox="0 0 120 140" style={{ width: 144, height: 144 }}>
    <ellipse cx="60" cy="138" rx="36" ry="9" fill="#8B5A2B" opacity={0.3} />
    <rect x="52" y="40" width="16" height="90" rx="6" fill="#A98467" />
    <ellipse cx="60" cy="35" rx="38" ry="26" fill="#2D6A4F" />
    <ellipse cx="48" cy="30" rx="22" ry="16" fill="#52B788" />
    <ellipse cx="72" cy="26" rx="16" ry="12" fill="#95D5B2" />
    <circle cx="42" cy="40" r="3.5" fill="#E9C46A" />
    <circle cx="75" cy="30" r="3" fill="#E9C46A" />
    <circle cx="55" cy="22" r="2.5" fill="#E9C46A" />
    <ellipse cx="60" cy="42" rx="6" ry="4" fill="#D4A373" />
  </svg>,
]

interface TreeAnimationProps {
  points: number
}

const STAGES = [
  { threshold: 0, label: "Seed", emoji: "🌰", nextThreshold: 50 },
  { threshold: 50, label: "Sprout", emoji: "🌱", nextThreshold: 150 },
  { threshold: 150, label: "Sapling", emoji: "🌿", nextThreshold: 350 },
  { threshold: 350, label: "Growing", emoji: "🌳", nextThreshold: 700 },
  { threshold: 700, label: "Fully Grown", emoji: "🌲", nextThreshold: Infinity },
]

export default function TreeAnimation({ points }: TreeAnimationProps) {
  const stage = points >= 700 ? 4 : points >= 350 ? 3 : points >= 150 ? 2 : points >= 50 ? 1 : 0
  const s = STAGES[stage]
  const next = s.nextThreshold
  const progress = next === Infinity ? 1 : (points - s.threshold) / (next - s.threshold)
  const clampedProgress = Math.max(0, Math.min(1, progress))

  const [growing, setGrowing] = useState(false)
  const [sparkles, setSparkles] = useState<{ id: number; x: number; y: number; delay: number }[]>([])
  const prevStageRef = useRef(stage)

  useEffect(() => {
    if (prevStageRef.current !== stage) {
      prevStageRef.current = stage
      setGrowing(true)
      const timer = setTimeout(() => setGrowing(false), 1200)
      const newSparkles = Array.from({ length: 8 }, (_, i) => ({
        id: Date.now() + i,
        x: 20 + Math.random() * 60,
        y: 10 + Math.random() * 50,
        delay: Math.random() * 0.4,
      }))
      setSparkles(newSparkles)
      setTimeout(() => setSparkles([]), 2000)
      return () => clearTimeout(timer)
    }
  }, [stage])

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <style>{`
        @keyframes treeGrow {
          0% { transform: scale(0.3); opacity: 0; }
          50% { transform: scale(1.15); opacity: 1; }
          70% { transform: scale(0.95); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes treeSway {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(1.5deg); }
          75% { transform: rotate(-1.5deg); }
        }
        @keyframes sparkleFade {
          0% { transform: scale(0) rotate(0deg); opacity: 0; }
          30% { transform: scale(1.2) rotate(180deg); opacity: 1; }
          100% { transform: scale(0) rotate(360deg); opacity: 0; }
        }
      `}</style>

      <div style={{ position: "relative", width: 144, height: 144 }}>
        {sparkles.map((sp) => (
          <div
            key={sp.id}
            style={{
              position: "absolute", left: `${sp.x}%`, top: `${sp.y}%`,
              width: 10 + Math.random() * 8, height: 10 + Math.random() * 8,
              borderRadius: "50%", pointerEvents: "none",
              background: Math.random() > 0.5
                ? "radial-gradient(circle, #E9C46A, #F4A261)"
                : "radial-gradient(circle, #95D5B2, #52B788)",
              animation: `sparkleFade 1.2s ease-out forwards`,
              animationDelay: `${sp.delay}s`,
            }}
          />
        ))}
        <div
          style={{
            transformOrigin: "bottom center",
            animation: growing ? "treeGrow 1.2s ease-out forwards" : "treeSway 4s ease-in-out infinite",
            width: 144, height: 144,
          }}
        >
          {TREES[stage]}
        </div>
      </div>

      <p style={{ marginTop: 4, fontSize: 14, fontWeight: 500, color: "var(--emerald)" }}>
        {s.emoji} {s.label}
      </p>

      {next !== Infinity && (
        <div style={{ marginTop: 8, width: "100%", maxWidth: 140 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "var(--grey-400)", marginBottom: 4 }}>
            <span>{points} pts</span>
            <span>{next} pts</span>
          </div>
          <div style={{ height: 6, width: "100%", borderRadius: 99, background: "var(--grey-200)", overflow: "hidden" }}>
            <div
              style={{
                height: "100%", borderRadius: 99,
                background: "linear-gradient(90deg, var(--emerald), var(--mint))",
                width: `${Math.round(clampedProgress * 100)}%`,
                transition: "width 0.7s ease-out",
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
