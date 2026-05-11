"use client"

import { useRef, useState } from "react"
import { Camera, Upload, Image as ImageIcon, Leaf, Loader2, CheckCircle, AlertCircle } from "lucide-react"


interface ScanResult {
  material: string
  confidence: number
  explanation: string
  pointsAwarded: number
  totalPoints: number
}

const MATERIAL_COLORS: Record<string, string> = {
  Plastic: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
  Metal: "bg-slate-100 text-slate-700 dark:bg-slate-800/40 dark:text-slate-300",
  Glass: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300",
  Paper: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  "Food Waste": "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
}

export default function ScanPage() {
  const ref = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ScanResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleScan() {
    if (!file) return
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const fd = new FormData()
      fd.append("image", file)
      const res = await fetch("/api/classify", { method: "POST", body: fd })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || "Classification failed")
      }
      const data = await res.json()
      setResult(data)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (f) {
      setPreview(URL.createObjectURL(f))
      setFile(f)
      setResult(null)
      setError(null)
    }
  }

  return (
    <main className="flex flex-1 flex-col items-center px-4 pb-24 pt-6">
      <div className="flex w-full max-w-lg flex-col items-center">
        <h1 className="font-serif text-2xl font-semibold text-forest dark:text-leaf">Scan Waste</h1>
        <p className="mt-1 text-sm text-muted">Take a photo or upload an image</p>

        <div className="mt-8 flex w-full flex-col items-center gap-4">
          <label className="flex w-full cursor-pointer flex-col items-center gap-3 rounded-3xl border-2 border-dashed border-card-border bg-card px-6 py-16 transition-colors hover:border-forest hover:bg-forest/5">
            {preview ? (
              <img src={preview} alt="Preview" className="max-h-48 rounded-xl object-contain" />
            ) : (
              <>
                <Camera size={40} className="text-muted" />
                <div className="text-center">
                  <p className="font-medium text-foreground">Tap to take a photo</p>
                  <p className="mt-1 text-xs text-muted">or click to upload from gallery</p>
                </div>
              </>
            )}
            <input ref={ref} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFile} />
          </label>

          {preview && !loading && !result && (
            <div className="flex w-full gap-3">
              <button
                onClick={handleScan}
                className="flex flex-1 items-center justify-center gap-2 rounded-full bg-forest px-6 py-3 font-medium text-white shadow-lg transition-all hover:bg-forest-light active:scale-[0.98]"
              >
                <Leaf size={18} />
                Classify Waste
              </button>
              <button
                onClick={() => ref.current?.click()}
                className="flex items-center justify-center gap-2 rounded-full border border-card-border bg-card px-4 py-3 font-medium text-muted transition-colors hover:text-foreground"
              >
                <Upload size={18} />
              </button>
            </div>
          )}

          {!preview && (
            <button
              onClick={() => ref.current?.click()}
              className="flex w-full items-center justify-center gap-2 rounded-full border border-card-border bg-card px-6 py-3 font-medium text-muted transition-colors hover:bg-forest/5 hover:text-foreground"
            >
              <Upload size={18} />
              Upload from Gallery
            </button>
          )}

          {loading && (
            <div className="flex w-full flex-col items-center gap-3 rounded-2xl bg-card p-6 shadow-sm ring-1 ring-card-border">
              <Loader2 size={28} className="animate-spin text-forest" />
              <p className="text-sm text-muted">Analyzing with Groq AI...</p>
              <div className="h-1.5 w-48 overflow-hidden rounded-full bg-sage/20">
                <div className="h-full w-1/2 rounded-full bg-gradient-to-r from-sage to-forest animate-shimmer" />
              </div>
            </div>
          )}

          {error && (
            <div className="flex w-full items-center gap-3 rounded-2xl bg-danger/10 p-4 ring-1 ring-danger/20">
              <AlertCircle size={20} className="shrink-0 text-danger" />
              <p className="text-sm text-danger">{error}</p>
            </div>
          )}

          {result && (
            <div className="w-full animate-fadeIn rounded-2xl bg-card p-5 shadow-sm ring-1 ring-card-border">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-forest/10">
                  <CheckCircle size={24} className="text-forest" />
                </div>
                <div className="flex-1">
                  <span className={`inline-block rounded-full px-3 py-0.5 text-xs font-medium ${MATERIAL_COLORS[result.material] || ""}`}>
                    {result.material}
                  </span>
                  <p className="mt-1 text-xs text-muted">
                    Confidence: {Math.round(result.confidence * 100)}%
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-serif text-lg font-bold text-forest">+{result.pointsAwarded}</p>
                  <p className="text-xs text-muted">points</p>
                </div>
              </div>
              <p className="mt-3 text-xs text-muted">{result.explanation}</p>
              <p className="mt-2 text-xs text-muted">
                Total points: <span className="font-medium text-foreground">{result.totalPoints}</span>
              </p>
            </div>
          )}
        </div>

        <div className="mt-8 w-full rounded-2xl bg-card p-4 shadow-sm ring-1 ring-card-border">
          <h3 className="text-sm font-medium text-foreground">Recent Scans</h3>
          <p className="mt-3 text-center text-sm text-muted">No scans yet. Start by taking a photo!</p>
        </div>
      </div>
    </main>
  )
}
