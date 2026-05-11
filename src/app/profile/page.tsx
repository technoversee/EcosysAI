import { Settings, History, Globe } from "lucide-react"
import TreeAnimation from "@/components/TreeAnimation"

export default function ProfilePage() {
  return (
    <main className="flex flex-1 flex-col items-center px-4 pb-24 pt-6">
      <div className="flex w-full max-w-lg flex-col items-center">
        <div className="flex items-center gap-3">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-forest text-xl font-bold text-white">
            ?
          </div>
          <div>
            <h1 className="font-serif text-xl font-semibold text-forest dark:text-leaf">Guest User</h1>
            <p className="text-sm text-muted">Sign in to save your progress</p>
          </div>
        </div>

        <div className="mt-6 flex w-full items-center justify-center rounded-3xl bg-card p-6 shadow-sm ring-1 ring-card-border">
          <TreeAnimation points={0} />
        </div>

        <div className="mt-4 grid w-full grid-cols-3 gap-3">
          {[
            { label: "Total Scans", value: "0" },
            { label: "Total Points", value: "0" },
            { label: "Badges", value: "0" },
          ].map(({ label, value }) => (
            <div key={label} className="flex flex-col items-center rounded-xl bg-card p-3 shadow-sm ring-1 ring-card-border">
              <span className="font-serif text-lg font-bold text-forest dark:text-leaf">{value}</span>
              <span className="text-xs text-muted">{label}</span>
            </div>
          ))}
        </div>

        <div className="mt-6 w-full space-y-2">
          {[
            { icon: History, label: "Scan History", desc: "View your past scans" },
            { icon: Globe, label: "Language", desc: "English / हिन्दी" },
            { icon: Settings, label: "Settings", desc: "App preferences" },
          ].map(({ icon: Icon, label, desc }) => (
            <button
              key={label}
              className="flex w-full items-center gap-3 rounded-xl bg-card px-4 py-3 text-left shadow-sm ring-1 ring-card-border transition-colors hover:ring-forest"
            >
              <Icon size={20} className="text-forest dark:text-leaf" />
              <div className="flex-1">
                <p className="text-sm font-medium">{label}</p>
                <p className="text-xs text-muted">{desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </main>
  )
}
