"use client"

import { useState, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"

export default function ScanPage() {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)
  const [scanning, setScanning] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [result, setResult] = useState<{
    material: string
    confidence: number
    pointsAwarded: number
    totalPoints: number
    explanation: string
    category: string
    bin: string
    tips: string[]
    image: string
  } | null>(null)
  const [error, setError] = useState("")

  const handleScan = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setScanning(true)
    setResult(null)
    setError("")
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

  const materialColor = (m: string) => {
    const colors: Record<string, string> = {
      Plastic: "#f59e0b", Metal: "#64748b", Glass: "#06b6d4",
      Paper: "#3b82f6", "Food Waste": "#16a34a",
    }
    return colors[m] || "#889296"
  }

  return (
    <div className="scanner-container">
      <div className="section-title" style={{ marginTop: 0 }}>AI Waste Scanner</div>

      <div className="camera-view" id="cameraView" onClick={() => !scanning && !result && fileRef.current?.click()} style={{ cursor: scanning || result ? "default" : "pointer" }}>
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
        {preview && !result && (
          <img src={preview} alt="Selected waste" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 16 }} />
        )}
        {(scanning || result) && !result && (
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

      {result && (
        <>
          <div className="scan-result" id="scanResult" style={{ borderTop: `4px solid ${materialColor(result.material)}` }}>
            {result.image && (
              <div style={{ textAlign: "center", marginBottom: 16 }}>
                <img src={result.image} alt="Scanned item" style={{ width: 120, height: 120, objectFit: "cover", borderRadius: 12, border: "2px solid var(--grey-200)" }} />
              </div>
            )}
            <div className="result-item">
              <span className="result-label">Item</span>
              <span className="result-value" id="resultItem" style={{ fontWeight: 700, color: materialColor(result.material) }}>{result.material}</span>
            </div>
            <div className="result-item">
              <span className="result-label">Category</span>
              <span className="result-value green" id="resultCategory">{result.category}</span>
            </div>
            <div className="result-item">
              <span className="result-label">Bin</span>
              <span className="result-value" id="resultBin">{result.bin}</span>
            </div>
            <div className="result-item">
              <span className="result-label">AI Confidence</span>
              <span className="result-value green" id="resultConfidence">{(result.confidence * 100).toFixed(0)}%</span>
            </div>
            <div className="result-item">
              <span className="result-label">EcoPoints Earned</span>
              <span className="result-value green" style={{ fontWeight: 700, fontSize: 18 }}>+{result.pointsAwarded}</span>
            </div>
            <div className="result-item" style={{ borderBottom: "none" }}>
              <span className="result-label">Explanation</span>
              <span className="result-value" style={{ fontSize: 13, color: "var(--grey-600)", whiteSpace: "normal" }}>{result.explanation}</span>
            </div>
          </div>

          {result.tips && result.tips.length > 0 && (
            <div className="card" style={{ marginTop: 16 }}>
              <div style={{ fontWeight: 600, marginBottom: 8, color: "var(--grey-700)", fontSize: 14 }}>Disposal Tips</div>
              {result.tips.map((tip, i) => (
                <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 6, fontSize: 13, color: "var(--grey-600)" }}>
                  <span style={{ color: materialColor(result.material), flexShrink: 0 }}>✦</span>
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      <div className="scan-actions">
        <button className="btn-primary" id="scanBtn" onClick={() => fileRef.current?.click()}>
          {scanning ? "Scanning..." : result ? "Scan Another" : "Start Scanning"}
        </button>
        {result && (
          <button className="btn-secondary" onClick={() => { setResult(null); setPreview(null); setError("") }}>
            Clear Result
          </button>
        )}
      </div>
    </div>
  )
}
