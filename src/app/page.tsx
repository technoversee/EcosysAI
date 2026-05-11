import { Camera, Leaf, TrendingUp, Users, Sparkles } from "lucide-react"
import TreeAnimation from "@/components/TreeAnimation"

const stats = [
  { icon: Camera, label: "Scans Today", value: "0" },
  { icon: Leaf, label: "Points Earned", value: "0" },
  { icon: TrendingUp, label: "Streak", value: "0 days" },
  { icon: Users, label: "Global Rank", value: "—" },
]

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col items-center px-5 pb-28 pt-6">
      <div className="flex w-full max-w-md flex-col items-center gap-6">
        {/* Hero */}
        <div className="relative w-full rounded-2xl bg-gradient-to-br from-pine/8 via-sand to-transparent px-6 py-8">
          <div className="absolute -right-6 -top-6 h-36 w-36 rounded-full bg-clay/8 blur-3xl" />
          <div className="absolute -bottom-4 -left-4 h-24 w-24 rounded-full bg-pine/6 blur-2xl" />
          <div className="relative">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-pine/8 px-3.5 py-1.5 text-xs font-medium text-pine">
              <span className="h-1.5 w-1.5 rounded-full bg-pine" />
              Start your journey
            </div>
            <h1 className="font-serif text-[1.65rem] leading-tight font-semibold tracking-tight text-pine">
              Scan waste,
              <br />
              <span className="text-clay">earn points</span>, grow nature
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-warm-grey">
            Every item you sort correctly brings us closer to a cleaner planet.
            </p>
          </div>
        </div>

        {/* Tree Card */}
        <div className="relative w-full rounded-2xl bg-card/70 px-5 py-6 ring-1 ring-card-border backdrop-blur-lg">
          <div className="absolute -left-3 -top-3 h-16 w-16 rounded-full bg-pine/5 blur-xl" />
          <div className="relative flex flex-col items-center">
            <TreeAnimation points={0} />
            <p className="mt-1 text-xs text-warm-grey">0 / 50 points to reach Sprout</p>
            <div className="mt-3 h-1.5 w-full max-w-40 overflow-hidden rounded-full bg-sage/15">
              <div className="h-full w-0 rounded-full bg-gradient-to-r from-sage to-pine transition-all duration-700" />
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid w-full grid-cols-2 gap-3">
          {stats.map(({ icon: Icon, label, value }, i) => (
            <div
              key={label}
              className="group rounded-2xl bg-card/70 px-4 py-4 ring-1 ring-card-border backdrop-blur-lg transition-all duration-200 hover:ring-pine/15"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="mb-2.5 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-pine/8">
                <Icon size={16} className="text-pine" />
              </div>
              <div className="font-serif text-xl font-semibold tracking-tight">{value}</div>
              <div className="mt-0.5 text-xs text-warm-grey">{label}</div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <a
          href="/scan"
          className="group relative inline-flex w-full items-center justify-center gap-2.5 overflow-hidden rounded-xl bg-pine px-5 py-3.5 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:bg-pine-light active:scale-[0.98]"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/8 to-white/0 opacity-0 transition-opacity group-hover:opacity-100" />
          <Camera size={18} />
          Scan Waste Now
        </a>
      </div>
    </main>
  )
}
