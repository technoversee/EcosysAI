import { Settings, History, Globe, User } from "lucide-react"
import TreeAnimation from "@/components/TreeAnimation"

export default function ProfilePage() {
  return (
    <main className="flex flex-1 flex-col items-center px-5 pb-28 pt-6">
      <div className="flex w-full max-w-md flex-col items-center gap-6">
        {/* Header */}
        <div className="flex w-full flex-col items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-pine to-pine-light text-xl font-bold text-white shadow-sm">
            ?
          </div>
          <div className="text-center">
            <h1 className="font-serif text-xl font-semibold text-pine">Guest User</h1>
            <p className="mt-0.5 text-sm text-warm-grey">Sign in to save your progress</p>
          </div>
        </div>

        {/* Tree */}
        <div className="relative w-full rounded-2xl bg-card/60 py-5 ring-1 ring-card-border backdrop-blur-sm">
          <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-pine/4 blur-2xl" />
          <div className="relative">
            <TreeAnimation points={0} />
          </div>
        </div>

        {/* Stats */}
        <div className="grid w-full grid-cols-3 gap-3">
          {[
            { label: "Scans", value: "0" },
            { label: "Points", value: "0" },
            { label: "Badges", value: "0" },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-1 rounded-xl bg-card/55 py-3 ring-1 ring-card-border backdrop-blur-sm"
            >
              <span className="font-serif text-lg font-semibold text-pine">{value}</span>
              <span className="text-xs text-warm-grey">{label}</span>
            </div>
          ))}
        </div>

        {/* Menu */}
        <div className="w-full space-y-2">
          {[
            { icon: History, label: "Scan History", desc: "View your past scans" },
            { icon: Globe, label: "Language", desc: "English / हिन्दी" },
            { icon: Settings, label: "Settings", desc: "App preferences" },
          ].map(({ icon: Icon, label, desc }) => (
            <button
              key={label}
              className="group flex w-full items-center gap-3 rounded-xl bg-card/50 px-4 py-3.5 text-left ring-1 ring-card-border backdrop-blur-sm transition-all duration-200 hover:ring-pine/15"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-pine/8 transition-colors group-hover:bg-pine/14">
                <Icon size={16} className="text-pine" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{label}</p>
                <p className="text-xs text-warm-grey">{desc}</p>
              </div>
              <span className="text-warm-grey">›</span>
            </button>
          ))}
        </div>
      </div>
    </main>
  )
}
