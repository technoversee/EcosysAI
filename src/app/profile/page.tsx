import { Settings, History, Globe, User } from "lucide-react"
import TreeAnimation from "@/components/TreeAnimation"

export default function ProfilePage() {
  return (
    <main className="flex flex-1 flex-col items-center px-5 pb-28 pt-4">
      <div className="flex w-full max-w-lg flex-col items-center">
        {/* Header */}
        <div className="relative w-full overflow-hidden rounded-3xl bg-gradient-to-b from-forest/10 via-forest/5 to-transparent p-8 text-center">
          <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-forest/5 blur-3xl" />
          <div className="relative flex flex-col items-center gap-3">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-forest to-forest-light text-2xl font-bold text-white shadow-lg">
              ?
            </div>
            <div>
              <h1 className="font-serif text-xl font-semibold text-forest dark:text-leaf">Guest User</h1>
              <p className="text-sm text-muted">Sign in to save your progress</p>
            </div>
          </div>
        </div>

        {/* Tree */}
        <div className="relative mt-5 w-full overflow-hidden rounded-3xl bg-card/70 p-6 shadow-sm ring-1 ring-card-border backdrop-blur-lg">
          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-leaf/5 blur-2xl" />
          <div className="relative">
            <TreeAnimation points={0} />
          </div>
        </div>

        {/* Stats */}
        <div className="mt-5 grid w-full grid-cols-3 gap-3">
          {[
            { label: "Scans", value: "0" },
            { label: "Points", value: "0" },
            { label: "Badges", value: "0" },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-1 rounded-2xl bg-card/70 p-3 shadow-sm ring-1 ring-card-border backdrop-blur-lg"
            >
              <span className="font-serif text-xl font-bold text-forest dark:text-leaf">{value}</span>
              <span className="text-xs text-muted">{label}</span>
            </div>
          ))}
        </div>

        {/* Menu */}
        <div className="mt-6 w-full space-y-2">
          {[
            { icon: History, label: "Scan History", desc: "View your past scans" },
            { icon: Globe, label: "Language", desc: "English / हिन्दी" },
            { icon: Settings, label: "Settings", desc: "App preferences" },
          ].map(({ icon: Icon, label, desc }) => (
            <button
              key={label}
              className="group flex w-full items-center gap-3 rounded-2xl bg-card/60 px-4 py-3.5 text-left shadow-sm ring-1 ring-card-border backdrop-blur-sm transition-all duration-200 hover:ring-forest/20"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-forest/10 transition-colors group-hover:bg-forest/20">
                <Icon size={18} className="text-forest dark:text-leaf" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{label}</p>
                <p className="text-xs text-muted">{desc}</p>
              </div>
              <span className="text-muted">›</span>
            </button>
          ))}
        </div>
      </div>
    </main>
  )
}
