"use client"

import { useRef, useState } from "react"
import { Camera, Upload, Image as ImageIcon, ScanLine } from "lucide-react"

export default function ScanPage() {
  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (f) setPreview(URL.createObjectURL(f))
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
          <h1 className="font-serif text-xl font-semibold tracking-tight text-pine md:text-2xl lg:text-3xl">
            Scan Waste
          </h1>
          <p className="mt-1 text-sm text-warm-grey md:text-base">
            Take a photo and let AI identify the material
          </p>
        </div>

        {/* Upload area — side by side on tablet+ */}
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

          {/* Result panel */}
          <div className="flex flex-col gap-3">
            <button
              onClick={() => inputRef.current?.click()}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-card-border bg-card/60 px-4 py-3 text-sm font-medium text-warm-grey backdrop-blur-sm transition-all duration-200 hover:border-pine/25 hover:bg-pine/4 hover:text-fg"
            >
              <Upload size={15} />
              Upload from Gallery
            </button>

            {preview ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 rounded-2xl bg-card/60 px-5 py-6 ring-1 ring-card-border backdrop-blur-sm">
                <div className="h-10 w-10 animate-pulse rounded-xl bg-sage/15" />
                <div className="w-full space-y-2">
                  <div className="h-3 w-1/3 rounded-full bg-sage/15" />
                  <div className="h-2.5 w-2/3 rounded-full bg-sage/10" />
                </div>
              </div>
            ) : (
              <div className="flex flex-1 items-center justify-center rounded-2xl bg-card/40 px-5 py-10 ring-1 ring-card-border backdrop-blur-sm md:py-0">
                <p className="text-sm text-warm-grey">Upload an image to see results</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent scans */}
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
