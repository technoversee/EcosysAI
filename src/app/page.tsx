import { Camera, Leaf, TrendingUp, Users, Sparkles } from "lucide-react"
import TreeAnimation from "@/components/TreeAnimation"
import { getDb } from "@/lib/db"
import { auth } from "@/lib/auth"

export const dynamic = "force-dynamic"

const stats = [
  { icon: Camera, label: "Scans Today", value: "0" },
  { icon: Leaf, label: "Points Earned", value: "0" },
  { icon: TrendingUp, label: "Streak", value: "0 days" },
  { icon: Users, label: "Global Rank", value: "—" },
]

export default async function HomePage() {
  const session = await auth()
  const db = getDb()

  let userStats = { points: 0, scans: 0, streak: "0d", rank: "—" }
  if (session?.user?.id) {
    const user = db.prepare("SELECT points FROM users WHERE id = ?").get(session.user.id) as any
    const sc = db.prepare("SELECT COUNT(*) as c FROM scans WHERE user_id = ?").get(session.user.id) as any
    const pos = (db.prepare("SELECT COUNT(*) as c FROM users WHERE points > ?").get(user?.points || 0) as any)?.c || 0
    userStats = {
      points: user?.points || 0,
      scans: sc?.c || 0,
      streak: "0d",
      rank: pos > 0 ? `#${pos + 1}` : "—",
    }
  }

  const displayStats = stats.map((s) => ({
    ...s,
    value: s.label === "Scans Today" ? String(userStats.scans) : s.label === "Points Earned" ? String(userStats.points) : s.label === "Streak" ? userStats.streak : userStats.rank,
  }))

  return (
    <main className="page">
      <div className="page-inner">
        {/* Hero */}
        <div className="relative w-full rounded-2xl bg-gradient-to-br from-pine/8 via-sand to-transparent px-6 py-8 md:rounded-3xl md:p-10 lg:flex lg:items-center lg:justify-between lg:gap-8">
          <div className="absolute -right-6 -top-6 h-36 w-36 rounded-full bg-clay/8 blur-3xl md:-right-8 md:-top-8 md:h-48 md:w-48" />
          <div className="absolute -bottom-4 -left-4 h-24 w-24 rounded-full bg-pine/6 blur-2xl" />
          <div className="relative lg:flex-1">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-pine/8 px-3.5 py-1.5 text-xs font-medium text-pine">
              <span className="h-1.5 w-1.5 rounded-full bg-pine" />
              {session?.user?.name ? `Welcome, ${session.user.name}` : "Start your journey"}
            </div>
            <h1 className="font-serif text-[1.65rem] leading-tight font-semibold tracking-tight text-pine md:text-2xl lg:text-3xl">
              Scan waste,<br /><span className="text-clay">earn points</span>, grow nature
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-warm-grey md:text-base">
              Every item you sort correctly brings us closer to a cleaner planet.
            </p>
          </div>
          <div className="mt-6 lg:mt-0 lg:shrink-0">
            <a href="/scan" className="group relative inline-flex w-full items-center justify-center gap-2.5 overflow-hidden rounded-xl bg-pine px-6 py-3.5 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:bg-pine-light active:scale-[0.98] md:rounded-2xl md:px-8 md:py-4 md:text-base lg:text-sm">
              <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/8 to-white/0 opacity-0 transition-opacity group-hover:opacity-100" />
              <Camera size={18} className="md:size-5" />
              Scan Waste Now
            </a>
          </div>
        </div>

        {/* Content grid */}
        <div className="grid w-full gap-5 md:grid-cols-2 lg:grid-cols-3">
          <div className="card card-hover flex flex-col items-center px-5 py-6 md:px-6 md:py-7 lg:col-span-1">
            <TreeAnimation points={userStats.points} />
            <p className="mt-2 text-xs text-warm-grey">{userStats.points} points — next at {userStats.points < 50 ? 50 : userStats.points < 150 ? 150 : userStats.points < 350 ? 350 : userStats.points < 700 ? 700 : "max"}</p>
            <div className="mt-3 h-1.5 w-full max-w-40 overflow-hidden rounded-full bg-sage/15">
              <div className="h-full w-0 rounded-full bg-gradient-to-r from-sage to-pine transition-all duration-700" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 md:col-span-1 lg:col-span-2 lg:grid-cols-2">
            {displayStats.map(({ icon: Icon, label, value }, i) => (
              <div key={label} className="card card-hover px-4 py-4 md:px-5 md:py-5" style={{ animationDelay: `${i * 80}ms` }}>
                <div className="mb-2.5 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-pine/8">
                  <Icon size={16} className="text-pine" />
                </div>
                <div className="font-serif text-xl font-semibold tracking-tight md:text-2xl">{value}</div>
                <div className="mt-0.5 text-xs text-warm-grey">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
