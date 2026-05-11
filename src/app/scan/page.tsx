import { Camera, Upload } from "lucide-react"

export default function ScanPage() {
  return (
    <main className="flex flex-1 flex-col items-center px-4 pb-24 pt-6">
      <div className="flex w-full max-w-lg flex-col items-center">
        <h1 className="font-serif text-2xl font-semibold text-forest dark:text-leaf">Scan Waste</h1>
        <p className="mt-1 text-sm text-muted">Take a photo or upload an image</p>

        <div className="mt-8 flex w-full flex-col items-center gap-4">
          <label className="flex w-full cursor-pointer flex-col items-center gap-3 rounded-3xl border-2 border-dashed border-card-border bg-card px-6 py-16 transition-colors hover:border-forest hover:bg-forest/5">
            <Camera size={40} className="text-muted" />
            <div className="text-center">
              <p className="font-medium text-foreground">Tap to take a photo</p>
              <p className="mt-1 text-xs text-muted">or click to upload from gallery</p>
            </div>
            <input type="file" accept="image/*" capture="environment" className="hidden" />
          </label>

          <button className="flex w-full items-center justify-center gap-2 rounded-full border border-card-border bg-card px-6 py-3 font-medium text-muted transition-colors hover:bg-forest/5 hover:text-foreground">
            <Upload size={18} />
            Upload from Gallery
          </button>
        </div>

        <div className="mt-8 w-full rounded-2xl bg-card p-4 shadow-sm ring-1 ring-card-border">
          <h3 className="text-sm font-medium text-foreground">Recent Scans</h3>
          <p className="mt-3 text-center text-sm text-muted">No scans yet. Start by taking a photo!</p>
        </div>
      </div>
    </main>
  )
}
