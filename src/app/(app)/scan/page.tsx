"use client"

import { useState, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"

const MATERIAL_MAP: Record<string, { category: string; bin: string }> = {
  Plastic: { category: "Recyclable", bin: "Blue Bin" },
  Metal: { category: "Recyclable", bin: "Blue Bin" },
  Glass: { category: "Recyclable", bin: "Blue Bin" },
  Paper: { category: "Recyclable", bin: "Blue Bin" },
  "Food Waste": { category: "Compostable", bin: "Green Bin" },
}

export default function ScanPage() {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)
  const [scanning, setScanning] = useState(false)
  const [result, setResult] = useState<{
    material: string
    confidence: number
    pointsAwarded: number
    totalPoints: number
    explanation: string
  } | null>(null)
  const [error, setError] = useState("")

  const handleScan = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setScanning(true)
    setResult(null)
    setError("")

    const formData = new FormData()
    formData.append("image", file)

    try {
      const res = await fetch("/api/classify", { method: "POST", body: formData })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || "Classification failed")
      }
      const data = await res.json()
      setTimeout(() => {
        setResult(data)
        setScanning(false)
      }, 2500)
    } catch (err: any) {
      setError(err.message)
      setScanning(false)
    }

    if (fileRef.current) fileRef.current.value = ""
  }, [])

  return (
    <div className="scanner-container">
      <div className="section-title" style={{ marginTop: 0 }}>AI Waste Scanner</div>

      <div className="camera-view" id="cameraView" onClick={() => fileRef.current?.click()} style={{ cursor: "pointer" }}>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleScan}
          style={{ display: "none" }}
        />
        <div className="placeholder-cam" style={{ display: scanning || result ? "none" : undefined }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
            <circle cx="12" cy="13" r="4" />
          </svg>
          <p>Tap to upload a waste image for AI classification</p>
        </div>
        {(scanning || result) && (
          <div className="scan-overlay" style={{ display: "block" }}>
            <div className="scan-line" />
            <div className="scan-corner tl" />
            <div className="scan-corner tr" />
            <div className="scan-corner bl" />
            <div className="scan-corner br" />
          </div>
        )}
      </div>

      {error && (
        <div className="scan-result" style={{ borderColor: "var(--danger)" }}>
          <div className="result-item">
            <span className="result-label" style={{ color: "var(--danger)" }}>{error}</span>
          </div>
        </div>
      )}

      {result && (
        <div className="scan-result" id="scanResult">
          <div className="result-item">
            <span className="result-label">Item</span>
            <span className="result-value" id="resultItem">{result.material}</span>
          </div>
          <div className="result-item">
            <span className="result-label">Category</span>
            <span className="result-value green" id="resultCategory">
              {MATERIAL_MAP[result.material]?.category || "Unknown"}
            </span>
          </div>
          <div className="result-item">
            <span className="result-label">Bin</span>
            <span className="result-value" id="resultBin">
              {MATERIAL_MAP[result.material]?.bin || "General Waste"}
            </span>
          </div>
          <div className="result-item">
            <span className="result-label">AI Confidence</span>
            <span className="result-value green" id="resultConfidence">
              {(result.confidence * 100).toFixed(0)}%
            </span>
          </div>
          <div className="result-item">
            <span className="result-label">EcoPoints Earned</span>
            <span className="result-value green">+{result.pointsAwarded}</span>
          </div>
        </div>
      )}

      <div className="scan-actions">
        <button
          className="btn-primary"
          id="scanBtn"
          onClick={() => fileRef.current?.click()}
        >
          {scanning ? "Scanning..." : result ? "Scan Another" : "Start Scanning"}
        </button>
        <button
          className="btn-secondary"
          id="guidanceBtn"
          style={{ display: result ? "block" : "none" }}
          onClick={() => router.push("/scan/guidance")}
        >
          Disposal Guidance
        </button>
      </div>
    </div>
  )
}
