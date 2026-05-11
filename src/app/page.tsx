import { Leaf, Camera, TrendingUp, Users, Sparkles } from "lucide-react"
import TreeAnimation from "@/components/TreeAnimation"

const stats = [
  { icon: Camera, label: "Scans Today", value: "0" },
  { icon: Leaf, label: "Points Earned", value: "0" },
  { icon: TrendingUp, label: "Streak", value: "0 days" },
  { icon: Users, label: "Global Rank", value: "—" },
]

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col items-center px-5 pb-28 pt-4">
      <div className="flex w-full max-w-lg flex-col items-center">
        {/* Hero */}
        <div className="relative w-full overflow-hidden rounded-3xl bg-gradient-to-b from-forest/10 via-forest/5 to-transparent p-8 text-center">
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-forest/5 blur-3xl" />
          <div className="absolute -bottom-6 -left-6 h-24 w-24 rounded-full bg-amber/10 blur-2xl" />
          <div className="relative">
            <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-2xl bg-forest/10 dark:bg-leaf/10">
              <Sparkles size={18} className="text-forest dark:text-leaf" />
            </div>
            <h1 className="font-serif text-3xl font-semibold tracking-tight text-forest dark:text-leaf">
              EcosysAI
            </h1>
            <p className="mt-1.5 text-sm text-muted">Scan waste, earn points, grow your tree</p>
          </div>
        </div>

        {/* Tree */}
        <div className="relative mt-6 w-full overflow-hidden rounded-3xl bg-card/70 p-6 text-center shadow-sm ring-1 ring-card-border backdrop-blur-lg">
          <div className="absolute -left-4 -top-4 h-20 w-20 rounded-full bg-leaf/5 blur-xl" />
          <TreeAnimation points={0} />
          <p className="mt-2 text-xs text-muted">0 / 50 points to reach Sprout</p>
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-sage/20">
            <div className="h-full w-0 rounded-full bg-gradient-to-r from-sage to-forest transition-all duration-700" />
          </div>
        </div>

        {/* Stats */}
        <div className="mt-5 grid w-full grid-cols-2 gap-3">
          {stats.map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-1.5 rounded-2xl bg-card/70 p-4 shadow-sm ring-1 ring-card-border backdrop-blur-lg transition-all duration-200 hover:ring-forest/20"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-forest/10 dark:bg-leaf/10">
                <Icon size={18} className="text-forest dark:text-leaf" />
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight">{value}</span>
              <span className="text-xs text-muted">{label}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <a
          href="/scan"
          className="group relative mt-6 flex w-full items-center justify-center gap-2.5 overflow-hidden rounded-full bg-forest px-6 py-3.5 font-medium text-white shadow-lg transition-all duration-200 hover:bg-forest-light active:scale-[0.98]"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/8 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
          <Camera size={20} />
          Scan Waste Now
        </a>
      </div>
    </main>
  )
}
