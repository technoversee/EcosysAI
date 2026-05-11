"use client"

import { useRef, useState } from "react"
import { Camera, Upload, Image as ImageIcon, ScanLine } from "lucide-react"

export default function ScanPage() {
  const ref = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (f) setPreview(URL.createObjectURL(f))
  }

  return (
    <main className="page">
      <div className="page-inner">
        {/* heading */}
        <div className="w-full">
          <p className="mb-1 text-xs font-medium text-accent">AI Recognition</p>
          <h1 className="font-serif text-2xl font-semibold tracking-tight text-primary">Scan Waste</h1>
          <p className="mt-1 text-sm text-muted">Take a photo to identify the material</p>
        </div>

        {/* upload */}
        <div
          onClick={() => ref.current?.click()}
          className="group relative w-full cursor-pointer rounded-2xl border-2 border-dashed border-border bg-surface/60 p-12 text-center transition-colors hover:border-primary/30"
        >
          {preview ? (
            <div className="flex flex-col items-center gap-3">
              <img src={preview} alt="" className="max-h-36 rounded-xl object-contain" />
              <span className="text-xs text-muted underline underline-offset-2">tap to retake</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/8">
                <Camera size={22} className="text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">Take a photo</p>
                <p className="mt-0.5 text-xs text-muted">or tap to upload</p>
              </div>
            </div>
          )}
          <input ref={ref} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFile} />
        </div>

        <button onClick={() => ref.current?.click()} className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-surface/50 px-4 py-3 text-sm font-medium text-muted transition-colors hover:border-primary/25 hover:text-primary">
          <Upload size={15} />
          Upload from Gallery
        </button>

        {/* result skeleton */}
        {preview && (
          <div className="w-full card p-4 animate-scaleIn">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 animate-pulse rounded-xl bg-primary/8" />
              <div className="flex-1 space-y-2">
                <div className="h-2.5 w-1/3 rounded-full bg-primary/6" />
                <div className="h-2 w-1/2 rounded-full bg-primary/4" />
              </div>
            </div>
          </div>
        )}

        {/* recent */}
        <div className="w-full">
          <h2 className="font-serif text-base font-semibold text-primary">Recent Scans</h2>
          <div className="mt-3 card flex flex-col items-center gap-3 p-8 text-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/6">
              <ImageIcon size={18} className="text-muted" />
            </div>
            <p className="text-sm text-muted">No scans yet.</p>
          </div>
        </div>
      </div>
    </main>
  )
}
