"use client"

import { useRef, useState } from "react"
import { Camera, Upload, Image as ImageIcon, ScanLine } from "lucide-react"

export default function ScanPage() {
  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) setPreview(URL.createObjectURL(file))
  }

  return (
    <main className="flex flex-1 flex-col items-center px-5 pb-28 pt-6">
      <div className="flex w-full max-w-md flex-col items-center gap-6">
        {/* Header */}
        <div className="w-full">
          <div className="mb-1 inline-flex items-center gap-2 rounded-full bg-pine/8 px-3.5 py-1.5 text-xs font-medium text-pine">
            <ScanLine size={12} />
            AI Recognition
          </div>
          <h1 className="font-serif text-xl font-semibold tracking-tight text-pine">
            Scan Waste
          </h1>
          <p className="mt-1 text-sm text-warm-grey">
            Take a photo and let AI identify the material
          </p>
        </div>

        {/* Upload Area */}
        <div
          onClick={() => inputRef.current?.click()}
          className="group relative w-full cursor-pointer rounded-2xl border-2 border-dashed border-card-border bg-card/50 p-10 text-center transition-all duration-200 hover:border-pine/30 hover:bg-pine/4"
        >
          <div className="absolute -right-6 -top-6 h-28 w-28 rounded-full bg-pine/4 blur-2xl transition-all group-hover:bg-pine/8" />
          <div className="relative">
            {preview ? (
              <div className="flex flex-col items-center gap-3">
                <img
                  src={preview}
                  alt="Preview"
                  className="max-h-44 rounded-xl object-contain shadow-sm"
                />
                <span className="text-xs text-warm-grey underline underline-offset-2">
                  Tap to retake
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-pine/8 transition-colors group-hover:bg-pine/14">
                  <Camera size={24} className="text-pine" />
                </div>
                <div>
                  <p className="text-sm font-medium">Take a photo</p>
                  <p className="mt-0.5 text-xs text-warm-grey">
                    or tap to upload from gallery
                  </p>
                </div>
              </div>
            )}
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={handleFile}
          />
        </div>

        <button
          onClick={() => inputRef.current?.click()}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-card-border bg-card/60 px-4 py-3 text-sm font-medium text-warm-grey backdrop-blur-sm transition-all duration-200 hover:border-pine/25 hover:bg-pine/4 hover:text-fg"
        >
          <Upload size={15} />
          Upload from Gallery
        </button>

        {/* Result Skeleton */}
        {preview && (
          <div className="w-full animate-fadeIn rounded-2xl bg-card/60 px-5 py-6 ring-1 ring-card-border backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 animate-pulse rounded-xl bg-sage/15" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-1/3 rounded-full bg-sage/15" />
                <div className="h-2.5 w-2/3 rounded-full bg-sage/10" />
              </div>
            </div>
          </div>
        )}

        {/* Recent */}
        <div className="w-full">
          <h2 className="font-serif text-base font-semibold text-pine">Recent Scans</h2>
          <div className="mt-3 flex flex-col items-center gap-3 rounded-2xl bg-card/50 p-8 text-center ring-1 ring-card-border backdrop-blur-sm">
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
