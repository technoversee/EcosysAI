"use client"

import { useState, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"

interface ScanResult {
  scanId: string
  material: string
  confidence: number
  pointsAwarded: number
  explanation: string
  category: string
  bin: string
  tips: string[]
  image: string
}

const MATERIAL_INFO: Record<string, { color: string; instructions: string[]; impact: string }> = {
  Plastic: {
    color: "#f59e0b",
    instructions: [
      "Empty any remaining liquid from the container",
      "Remove caps, pumps, and labels (recycle separately if possible)",
      "Rinse briefly to remove food residue",
      "Crush to save space in the recycling bin",
      "Place in the Blue Recycling Bin",
    ],
    impact: "Recycling one plastic bottle saves enough energy to power a 60W light bulb for 6 hours and reduces CO₂ emissions by approximately 0.4kg.",
  },
  Metal: {
    color: "#64748b",
    instructions: [
      "Rinse food cans thoroughly to remove residue",
      "Remove any plastic liners or lids",
      "Aluminum foil can be recycled if clean and balled together",
      "Cans can be crushed to save space",
      "Place in the Blue Recycling Bin",
    ],
    impact: "Recycling one aluminum can saves enough energy to run a TV for 3 hours. Aluminum can be recycled infinitely without losing quality.",
  },
  Glass: {
    color: "#06b6d4",
    instructions: [
      "Rinse bottles and jars to remove contents",
      "Remove metal lids and corks — recycle separately",
      "Separate by color if your local facility requires it",
      "Never recycle broken windows, mirrors, or Pyrex",
      "Place in the Blue Recycling Bin",
    ],
    impact: "Glass can be recycled endlessly without losing purity or quality. Recycling one glass bottle saves enough energy to power a computer for 25 minutes.",
  },
  Paper: {
    color: "#3b82f6",
    instructions: [
      "Keep paper dry and clean — wet paper cannot be recycled",
      "Remove plastic windows from envelopes and staples",
      "Flatten cardboard boxes to save space",
      "Shred documents containing sensitive information",
      "Place in the Blue Recycling Bin",
    ],
    impact: "Recycling one ton of paper saves 17 trees, 26,000 liters of water, and keeps 2.5 tons of CO₂ out of the atmosphere.",
  },
  "Food Waste": {
    color: "#16a34a",
    instructions: [
      "Use a countertop compost bin for daily collection",
      "Avoid meat, dairy, and oily foods in home compost",
      "Coffee grounds, eggshells, and fruit peels are excellent for compost",
      "Layer green waste (food scraps) with brown waste (leaves, paper)",
      "Place in the Green Compost Bin",
    ],
    impact: "Composting food waste reduces methane emissions from landfills by up to 50%. Food waste accounts for 8% of global greenhouse gas emissions.",
  },
}

export default function ScanPage() {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)
  const [scanning, setScanning] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [result, setResult] = useState<ScanResult | null>(null)
  const [error, setError] = useState("")
  const [step, setStep] = useState<"result" | "guidance" | "confirming" | "celebrate">("result")
  const [earned, setEarned] = useState<{ pointsAwarded: number; totalPoints: number } | null>(null)

  const matInfo = result ? MATERIAL_INFO[result.material] : null

  const handleScan = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setScanning(true)
    setResult(null)
    setError("")
    setStep("result")
    setEarned(null)
    setPreview(URL.createObjectURL(file))

    const formData = new FormData()
    formData.append("image", file)

    try {
      const res = await fetch("/api/classify", { method: "POST", body: formData })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || "Classification failed")
      }
      const data = await res.json()
      setResult(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setScanning(false)
    }

    if (fileRef.current) fileRef.current.value = ""
  }, [])

  const handleConfirm = useCallback(async () => {
    if (!result) return
    setStep("confirming")
    try {
      const res = await fetch("/api/scans/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scanId: result.scanId }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Confirmation failed")
      setEarned(data)
      setStep("celebrate")
    } catch (err: any) {
      setError(err.message)
      setStep("result")
    }
  }, [result])

  const color = matInfo?.color || "#889296"
  const co2Saved = result?.material ? 0.4 : 0
  const xpEarned = earned ? (earned.pointsAwarded * 2.5).toFixed(0) : "0"

  return (
    <div className="scanner-container">
      <div className="section-title" style={{ marginTop: 0 }}>AI Waste Scanner</div>

      {/* ── Camera / Image Area ── */}
      <div className="camera-view" id="cameraView"
        onClick={() => !scanning && !result && fileRef.current?.click()}
        style={{ cursor: scanning || result ? "default" : "pointer" }}
      >
        <input ref={fileRef} type="file" accept="image/*" capture="environment" onChange={handleScan} style={{ display: "none" }} />
        {!preview && !scanning && !result && (
          <div className="placeholder-cam">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
            <p>Tap to upload a waste image for AI classification</p>
          </div>
        )}
        {preview && step !== "celebrate" && !scanning && !(result && step === "result") && (
          <img src={preview} alt="Selected waste" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 16 }} />
        )}
        {(scanning || step === "guidance") && (
          <div className="scan-overlay" style={{ display: "block" }}>
            <div className="scan-line" />
            <div className="scan-corner tl" /><div className="scan-corner tr" />
            <div className="scan-corner bl" /><div className="scan-corner br" />
          </div>
        )}
      </div>

      {scanning && (
        <div style={{ textAlign: "center", padding: 16, color: "var(--grey-500)", fontSize: 14 }}>
          Analyzing with AI... <span style={{ animation: "pulse-dot 1.5s infinite" }}>▸</span>
        </div>
      )}

      {error && (
        <div className="scan-result" style={{ borderColor: "var(--danger)" }}>
          <div className="result-item">
            <span className="result-label" style={{ color: "var(--danger)" }}>{error}</span>
          </div>
        </div>
      )}

      {/* ── STEP 1: Scan Result ── */}
      {result && step === "result" && (
        <>
          <div className="scan-result" id="scanResult" style={{ borderTop: `4px solid ${color}` }}>
            {result.image && (
              <div style={{ textAlign: "center", marginBottom: 16 }}>
                <img src={result.image} alt="Scanned item" style={{ width: 100, height: 100, objectFit: "cover", borderRadius: 12, border: "2px solid var(--grey-200)" }} />
              </div>
            )}
            <div className="result-item">
              <span className="result-label">Item</span>
              <span className="result-value" style={{ fontWeight: 700, color, fontSize: 16 }}>{result.material}</span>
            </div>
            <div className="result-item">
              <span className="result-label">Category</span>
              <span className="result-value green">{result.category}</span>
            </div>
            <div className="result-item">
              <span className="result-label">Correct Bin</span>
              <span className="result-value">{result.bin}</span>
            </div>
            <div className="result-item">
              <span className="result-label">AI Confidence</span>
              <span className="result-value green">{(result.confidence * 100).toFixed(0)}%</span>
            </div>
            <div className="result-item">
              <span className="result-label">Potential Points</span>
              <span className="result-value green" style={{ fontWeight: 700 }}>+{result.pointsAwarded}</span>
            </div>
            <div className="result-item" style={{ borderBottom: "none" }}>
              <span className="result-label">Why?</span>
              <span className="result-value" style={{ fontSize: 13, color: "var(--grey-600)", whiteSpace: "normal" }}>{result.explanation}</span>
            </div>
          </div>

          {result.tips && result.tips.length > 0 && (
            <div className="card" style={{ marginTop: 16 }}>
              <div style={{ fontWeight: 600, marginBottom: 8, color: "var(--grey-700)", fontSize: 14 }}>Quick Tips</div>
              {result.tips.map((tip, i) => (
                <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 6, fontSize: 13, color: "var(--grey-600)" }}>
                  <span style={{ color, flexShrink: 0 }}>✦</span>
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          )}

          <div className="scan-actions">
            <button className="btn-primary" onClick={() => setStep("guidance")}>
              Disposal Guidance & Confirm
            </button>
            <button className="btn-secondary" onClick={() => { setResult(null); setPreview(null); setError("") }}>
              Scan Different Item
            </button>
          </div>
        </>
      )}

      {/* ── STEP 2: Disposal Guidance + Confirm ── */}
      {result && step === "guidance" && matInfo && (
        <>
          <div className="scan-result" style={{ borderTop: `4px solid ${color}` }}>
            <div className="result-item">
              <span className="result-label">Item</span>
              <span className="result-value" style={{ fontWeight: 700, color }}>{result.material}</span>
            </div>
            <div className="result-item">
              <span className="result-label">Category</span>
              <span className="result-value green">{result.category}</span>
            </div>
            <div className="result-item">
              <span className="result-label">Correct Bin</span>
              <span className="result-value">🔵 {result.bin}</span>
            </div>
          </div>

          <div className="card" style={{ marginTop: 16 }}>
            <div className="card-title" style={{ marginBottom: 12 }}>Recycling Instructions</div>
            {matInfo.instructions.map((inst, i) => (
              <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 8, fontSize: 14, color: "var(--grey-700)" }}>
                <span style={{ width: 20, height: 20, borderRadius: "50%", background: color, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{i + 1}</span>
                <span>{inst}</span>
              </div>
            ))}
          </div>

          <div className="card" style={{ marginTop: 16 }}>
            <div className="card-title" style={{ marginBottom: 8 }}>Environmental Impact</div>
            <p style={{ fontSize: 14, color: "var(--grey-600)", lineHeight: 1.7 }}>{matInfo.impact}</p>
          </div>

          <div className="scan-actions">
            <button className="btn-primary" style={{ background: "linear-gradient(135deg, var(--emerald), var(--mint))" }} onClick={handleConfirm}>
              ✅ Confirm Disposal — Earn +{result.pointsAwarded} Points
            </button>
            <button className="btn-secondary" onClick={() => setStep("result")}>
              Back to Result
            </button>
          </div>
        </>
      )}

      {step === "confirming" && (
        <div style={{ textAlign: "center", padding: 40, color: "var(--grey-500)" }}>
          Processing...
        </div>
      )}

      {/* ── STEP 3: Celebration ── */}
      {earned && step === "celebrate" && result && (
        <div className="reward-earned" style={{ textAlign: "center", padding: "32px 0" }}>
          <div style={{ fontSize: 64, marginBottom: 8 }}>🎉</div>
          <div style={{ fontSize: 48, fontWeight: 900, color: "var(--emerald)", marginBottom: 4 }}>
            +{earned.pointsAwarded}
          </div>
          <div style={{ fontSize: 16, color: "var(--grey-500)", marginBottom: 24 }}>EcoPoints Earned</div>

          <div className="card" style={{ marginBottom: 24 }}>
            <div className="reward-detail" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div style={{ textAlign: "center", padding: 12 }}>
                <strong style={{ fontSize: 22, display: "block", color: "var(--grey-800)" }}>+{xpEarned} XP</strong>
                <span style={{ fontSize: 13, color: "var(--grey-500)" }}>Sustainability XP</span>
              </div>
              <div style={{ textAlign: "center", padding: 12 }}>
                <strong style={{ fontSize: 22, display: "block", color: "var(--grey-800)" }}>{co2Saved} kg</strong>
                <span style={{ fontSize: 13, color: "var(--grey-500)" }}>CO₂ Saved</span>
              </div>
            </div>
          </div>

          <div style={{ fontSize: 13, color: "var(--grey-400)", marginBottom: 24 }}>
            Total Balance: <strong style={{ color: "var(--emerald)" }}>{earned.totalPoints}</strong> EcoPoints
          </div>

          <div className="scan-actions" style={{ gap: 12 }}>
            <button className="btn-primary" onClick={() => router.push("/dashboard")}>
              Continue to Dashboard
            </button>
            <button className="btn-secondary" onClick={() => router.push("/rewards")}>
              Redeem Rewards
            </button>
            <button className="btn-secondary" onClick={() => { setResult(null); setPreview(null); setEarned(null); setStep("result"); setError("") }}>
              Scan Another Item
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
