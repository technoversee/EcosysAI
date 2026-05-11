import { Camera, Leaf, TrendingUp, Users } from "lucide-react"
import TreeAnimation from "@/components/TreeAnimation"

const STATS = [
  { icon: Camera, label: "Scans", value: "0" },
  { icon: Leaf, label: "Points", value: "0" },
  { icon: TrendingUp, label: "Streak", value: "0d" },
  { icon: Users, label: "Rank", value: "—" },
]

export default function HomePage() {
  return (
    <main className="page">
      <div className="page-inner">
        {/* hero */}
        <div className="w-full text-center">
          <p className="mb-1.5 text-xs font-medium text-accent">Welcome back</p>
          <h1 className="font-serif text-3xl font-semibold tracking-tight text-primary">
            Let&apos;s sort some waste
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Scan any item to learn how to dispose it correctly and earn points.
          </p>
        </div>

        {/* tree */}
        <div className="w-full card p-6">
          <div className="flex flex-col items-center">
            <TreeAnimation points={0} />
            <p className="mt-2 text-xs text-muted">0 / 50 pts → Sprout</p>
            <div className="mt-3 h-1 w-full max-w-32 rounded-full bg-primary/8">
              <div className="h-full w-0 rounded-full bg-gradient-to-r from-accent to-primary transition-all duration-700" />
            </div>
          </div>
        </div>

        {/* stats */}
        <div className="grid w-full grid-cols-4 gap-2">
          {STATS.map(({ icon: Icon, label, value }) => (
            <div key={label} className="card flex flex-col items-center gap-1 px-2 py-3">
              <Icon size={15} className="text-primary" />
              <span className="font-serif text-base font-semibold">{value}</span>
              <span className="text-[10px] text-muted">{label}</span>
            </div>
          ))}
        </div>

        {/* actions */}
        <div className="flex w-full gap-3">
          <a href="/scan" className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-medium text-white shadow-sm transition-all active:scale-[0.97]">
            <Camera size={17} />
            Scan
          </a>
          <a href="/leaderboard" className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-border px-5 py-3 text-sm font-medium text-primary transition-all active:scale-[0.97]">
            <Users size={17} />
            Rankings
          </a>
        </div>
      </div>
    </main>
  )
}
