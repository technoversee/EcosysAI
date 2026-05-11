"use client"

import { useRef, useState } from "react"
import { Camera, Upload, Image as ImageIcon } from "lucide-react"

export default function ScanPage() {
  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) setPreview(URL.createObjectURL(file))
  }

  return (
    <main className="flex flex-1 flex-col items-center px-5 pb-28 pt-4">
      <div className="flex w-full max-w-lg flex-col items-center">
        <div className="relative w-full overflow-hidden rounded-3xl bg-gradient-to-b from-forest/10 via-forest/5 to-transparent p-8 text-center">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-forest/5 blur-3xl" />
          <h1 className="relative font-serif text-2xl font-semibold tracking-tight text-forest dark:text-leaf">
            Scan Waste
          </h1>
          <p className="relative mt-1.5 text-sm text-muted">Take a photo to identify the material</p>
        </div>

        <div className="mt-6 w-full">
          <div
            onClick={() => inputRef.current?.click()}
            className="group relative flex cursor-pointer flex-col items-center gap-4 overflow-hidden rounded-3xl border-2 border-dashed border-card-border bg-card/60 p-12 transition-all duration-200 hover:border-forest/40 hover:bg-forest/5"
          >
            <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-leaf/5 blur-2xl transition-all group-hover:bg-leaf/10" />
            {preview ? (
              <img src={preview} alt="Preview" className="relative max-h-48 rounded-xl object-contain" />
            ) : (
              <div className="relative flex flex-col items-center gap-3">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-forest/10 transition-colors group-hover:bg-forest/20">
                  <Camera size={28} className="text-forest dark:text-leaf" />
                </div>
                <div className="text-center">
                  <p className="font-medium text-foreground">Tap to take a photo</p>
                  <p className="mt-0.5 text-xs text-muted">or click to upload from gallery</p>
                </div>
              </div>
            )}
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={handleFile}
            />
            {preview && (
              <span className="relative text-xs text-muted group-hover:text-foreground">
                Tap again to retake
              </span>
            )}
          </div>

          <button
            onClick={() => inputRef.current?.click()}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-card-border bg-card/50 px-5 py-3 text-sm font-medium text-muted backdrop-blur-lg transition-all duration-200 hover:border-forest/30 hover:bg-forest/5 hover:text-foreground"
          >
            <Upload size={16} />
            Upload from Gallery
          </button>
        </div>

        {/* Result placeholder */}
        {preview && (
          <div className="mt-5 w-full animate-fadeIn rounded-2xl bg-card/70 p-5 shadow-sm ring-1 ring-card-border backdrop-blur-lg">
            <p className="text-center text-sm text-muted">Analyzing...</p>
          </div>
        )}

        {/* Recent scans */}
        <div className="mt-8 w-full">
          <h3 className="font-serif text-base font-semibold text-forest dark:text-leaf">Recent Scans</h3>
          <div className="mt-3 flex flex-col items-center gap-3 rounded-2xl bg-card/60 p-8 text-center ring-1 ring-card-border backdrop-blur-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sage/20">
              <ImageIcon size={20} className="text-muted" />
            </div>
            <p className="text-sm text-muted">No scans yet. Start by taking a photo!</p>
          </div>
        </div>
      </div>
    </main>
  )
}
