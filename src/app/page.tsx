import { Leaf, Camera, TrendingUp, Users } from "lucide-react"
import TreeAnimation from "@/components/TreeAnimation"

const stats = [
  { icon: Camera, label: "Scans Today", value: "0" },
  { icon: Leaf, label: "Points Earned", value: "0" },
  { icon: TrendingUp, label: "Streak", value: "0 days" },
  { icon: Users, label: "Global Rank", value: "—" },
]

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col items-center px-4 pb-24 pt-6">
      <div className="flex w-full max-w-lg flex-col items-center">
        <h1 className="font-serif text-2xl font-semibold text-forest dark:text-leaf">EcosysAI</h1>
        <p className="mt-1 text-sm text-muted">Scan. Sort. Earn.</p>

        <div className="mt-6 flex w-full flex-col items-center rounded-3xl bg-card p-6 shadow-sm ring-1 ring-card-border">
          <TreeAnimation points={0} />
          <p className="mt-2 text-center text-xs text-muted">Keep scanning to grow your tree!</p>
        </div>

        <div className="mt-6 grid w-full grid-cols-2 gap-3">
          {stats.map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-1 rounded-2xl bg-card p-4 shadow-sm ring-1 ring-card-border"
            >
              <Icon size={20} className="text-forest dark:text-leaf" />
              <span className="font-serif text-xl font-semibold">{value}</span>
              <span className="text-xs text-muted">{label}</span>
            </div>
          ))}
        </div>

        <a
          href="/scan"
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-forest px-6 py-3 font-medium text-white shadow-lg transition-all hover:bg-forest-light active:scale-[0.98]"
        >
          <Camera size={20} />
          Scan Waste
        </a>
      </div>
    </main>
  )
}
