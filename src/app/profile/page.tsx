import { Settings, History, Globe } from "lucide-react"
import TreeAnimation from "@/components/TreeAnimation"

export default function ProfilePage() {
  return (
    <main className="page">
      <div className="page-inner">
        {/* avatar */}
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-light text-xl font-bold text-white shadow-sm">
            ?
          </div>
          <div className="text-center">
            <h1 className="font-serif text-xl font-semibold text-primary">Guest User</h1>
            <p className="mt-0.5 text-sm text-muted">Sign in to save progress</p>
          </div>
        </div>

        {/* tree */}
        <div className="w-full card py-5">
          <TreeAnimation points={0} />
        </div>

        {/* stats */}
        <div className="grid w-full grid-cols-3 gap-3">
          {[
            { label: "Scans", value: "0" },
            { label: "Points", value: "0" },
            { label: "Badges", value: "0" },
          ].map((s) => (
            <div key={s.label} className="card flex flex-col items-center gap-1 py-3">
              <span className="font-serif text-base font-semibold text-primary">{s.value}</span>
              <span className="text-[11px] text-muted">{s.label}</span>
            </div>
          ))}
        </div>

        {/* menu */}
        <div className="w-full space-y-2">
          {[
            { icon: History, label: "Scan History", desc: "View past scans" },
            { icon: Globe, label: "Language", desc: "English / हिन्दी" },
            { icon: Settings, label: "Settings", desc: "Preferences" },
          ].map(({ icon: Icon, label, desc }) => (
            <button key={label} className="group card flex w-full items-center gap-3 px-4 py-3.5 text-left">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/8">
                <Icon size={16} className="text-primary" />
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
