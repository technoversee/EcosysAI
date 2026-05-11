import { Settings, History, Globe } from "lucide-react"
import TreeAnimation from "@/components/TreeAnimation"

export default function ProfilePage() {
  return (
    <main className="page">
      <div className="page-inner">
        {/* Avatar + Info — responsive row on tablet+ */}
        <div className="flex w-full flex-col items-center gap-4 md:flex-row md:gap-6 lg:gap-8">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-pine to-pine-light text-xl font-bold text-white shadow-sm md:h-20 md:w-20 md:text-2xl">
            ?
          </div>
          <div className="text-center md:text-left">
            <h1 className="font-serif text-xl font-semibold text-pine md:text-2xl">Guest User</h1>
            <p className="mt-0.5 text-sm text-warm-grey">Sign in to save your progress</p>
          </div>
        </div>

        {/* Tree + Stats — side by side on tablet+ */}
        <div className="grid w-full gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
          <div className="card py-5 md:py-6 lg:col-span-1">
            <TreeAnimation points={0} />
          </div>

          <div className="card p-5 md:p-6 lg:col-span-2">
            <div className="grid grid-cols-3 gap-3 md:gap-4">
              {[
                { label: "Scans", value: "0" },
                { label: "Points", value: "0" },
                { label: "Badges", value: "0" },
              ].map(({ label, value }) => (
                <div key={label} className="flex flex-col items-center gap-1">
                  <span className="font-serif text-lg font-semibold text-pine md:text-xl">{value}</span>
                  <span className="text-xs text-warm-grey">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Menu — responsive columns on tablet+ */}
        <div className="grid w-full gap-2 md:grid-cols-2 md:gap-3 lg:grid-cols-3">
          {[
            { icon: History, label: "Scan History", desc: "View your past scans" },
            { icon: Globe, label: "Language", desc: "English / हिन्दी" },
            { icon: Settings, label: "Settings", desc: "App preferences" },
          ].map(({ icon: Icon, label, desc }) => (
            <button
              key={label}
              className="group card flex w-full items-center gap-3 px-4 py-3.5 text-left hover:ring-pine/15 md:px-5 md:py-4"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-pine/8 transition-colors group-hover:bg-pine/14 md:h-10 md:w-10">
                <Icon size={16} className="text-pine md:size-[18px]" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium md:text-base">{label}</p>
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
