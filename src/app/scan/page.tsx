"use client"

import { useRef, useState } from "react"
import { Camera, Upload, Image as ImageIcon, ScanLine, Leaf, Loader2, CheckCircle, AlertCircle } from "lucide-react"

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
  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ScanResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleScan() {
    if (!file) return
    setLoading(true); setError(null); setResult(null)
    try {
      const fd = new FormData(); fd.append("image", file)
      const res = await fetch("/api/classify", { method: "POST", body: fd })
      if (!res.ok) { const e = await res.json(); throw new Error(e.error || "Classification failed") }
      setResult(await res.json())
    } catch (e: any) { setError(e.message) }
    finally { setLoading(false) }
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (f) { setPreview(URL.createObjectURL(f)); setFile(f); setResult(null); setError(null) }
  }

  return (
    <main className="page">
      <div className="page-inner">
        {/* Header */}
        <div className="w-full">
          <div className="mb-1 inline-flex items-center gap-2 rounded-full bg-pine/8 px-3.5 py-1.5 text-xs font-medium text-pine">
            <ScanLine size={12} />
            AI Recognition
          </div>
          <h1 className="font-serif text-xl font-semibold tracking-tight text-pine md:text-2xl lg:text-3xl">Scan Waste</h1>
          <p className="mt-1 text-sm text-warm-grey md:text-base">Take a photo and let AI identify the material</p>
        </div>

        {/* Upload + Result */}
        <div className="grid w-full gap-4 md:grid-cols-2 md:gap-6">
          <div
            onClick={() => inputRef.current?.click()}
            className="group relative flex cursor-pointer flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-card-border bg-card/50 p-10 text-center transition-all duration-200 hover:border-pine/30 hover:bg-pine/4 md:min-h-[280px]"
          >
            <div className="absolute -right-6 -top-6 h-28 w-28 rounded-full bg-pine/4 blur-2xl transition-all group-hover:bg-pine/8" />
            <div className="relative">
              {preview ? (
                <div className="flex flex-col items-center gap-3">
                  <img src={preview} alt="" className="max-h-44 rounded-xl object-contain shadow-sm" />
                  <span className="text-xs text-warm-grey underline underline-offset-2">Tap to retake</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-pine/8 transition-colors group-hover:bg-pine/14 md:h-16 md:w-16">
                    <Camera size={24} className="text-pine md:size-[26px]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Take a photo</p>
                    <p className="mt-0.5 text-xs text-warm-grey">or tap to upload from gallery</p>
                  </div>
                </div>
              )}
            </div>
            <input ref={inputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFile} />
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex gap-2">
              {preview && !loading && !result && (
                <button onClick={handleScan} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-pine px-4 py-3 text-sm font-medium text-white shadow-sm transition-all hover:bg-pine-light active:scale-[0.98]">
                  <Leaf size={16} />
                  Classify
                </button>
              )}
              <button onClick={() => inputRef.current?.click()} className="flex items-center justify-center gap-2 rounded-xl border border-card-border bg-card/60 px-4 py-3 text-sm font-medium text-warm-grey backdrop-blur-sm transition-all duration-200 hover:border-pine/25 hover:bg-pine/4 hover:text-fg">
                <Upload size={15} />
                {preview ? "Retake" : "Upload"}
              </button>
            </div>

            {loading && (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 rounded-2xl bg-card/60 px-5 py-8 ring-1 ring-card-border backdrop-blur-sm">
                <Loader2 size={28} className="animate-spin text-pine" />
                <p className="text-sm text-warm-grey">Analyzing with AI...</p>
                <div className="h-1.5 w-36 overflow-hidden rounded-full bg-sage/20">
                  <div className="h-full w-1/2 rounded-full bg-gradient-to-r from-sage to-pine animate-shimmer" />
                </div>
              </div>
            )}

            {error && (
              <div className="flex items-center gap-3 rounded-xl bg-danger/10 p-4 ring-1 ring-danger/20">
                <AlertCircle size={18} className="shrink-0 text-danger" />
                <p className="text-sm text-danger">{error}</p>
              </div>
            )}

            {result && (
              <div className="flex flex-1 flex-col justify-center rounded-2xl bg-card/60 px-5 py-6 ring-1 ring-card-border backdrop-blur-sm animate-fadeIn">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-pine/10">
                    <CheckCircle size={24} className="text-pine" />
                  </div>
                  <div className="flex-1">
                    <span className={`inline-block rounded-full px-3 py-0.5 text-xs font-medium ${MATERIAL_COLORS[result.material] || ""}`}>{result.material}</span>
                    <p className="mt-1 text-xs text-warm-grey">Confidence: {Math.round(result.confidence * 100)}%</p>
                  </div>
                  <div className="text-right">
                    <p className="font-serif text-lg font-bold text-pine">+{result.pointsAwarded}</p>
                    <p className="text-xs text-warm-grey">pts</p>
                  </div>
                </div>
                <p className="mt-3 text-xs text-warm-grey">{result.explanation}</p>
                <p className="mt-2 text-xs text-warm-grey">Total: <span className="font-medium text-fg">{result.totalPoints}</span></p>
              </div>
            )}

            {!preview && !loading && !result && !error && (
              <div className="flex flex-1 items-center justify-center rounded-2xl bg-card/40 px-5 py-10 ring-1 ring-card-border backdrop-blur-sm md:py-0">
                <p className="text-sm text-warm-grey">Upload to see results</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent */}
        <div className="w-full">
          <h2 className="font-serif text-base font-semibold text-pine md:text-lg">Recent Scans</h2>
          <div className="mt-3 flex flex-col items-center gap-3 rounded-2xl bg-card/50 p-8 text-center ring-1 ring-card-border backdrop-blur-sm md:p-10">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sage/12">
              <ImageIcon size={18} className="text-warm-grey" />
            </div>
            <p className="text-sm text-warm-grey">No scans yet.</p>
          </div>
        </div>
      </div>
    </main>
  )
}
