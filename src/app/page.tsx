import { Leaf, Camera, TrendingUp, Users } from "lucide-react"
import TreeAnimation from "@/components/TreeAnimation"
import { getDb } from "@/lib/db"
import { auth } from "@/lib/auth"

export const dynamic = "force-dynamic"

export default async function HomePage() {
  const session = await auth()
  const db = getDb()

  let userStats = { points: 0, scans: 0, streak: "0d", rank: "—" }
  let topCount = 0

  if (session?.user?.id) {
    const user = db.prepare("SELECT points FROM users WHERE id = ?").get(session.user.id) as any
    const scanCount = db.prepare("SELECT COUNT(*) as c FROM scans WHERE user_id = ?").get(session.user.id) as any
    topCount = (db.prepare("SELECT COUNT(*) as c FROM users WHERE points > ?").get(user?.points || 0) as any)?.c || 0

    userStats = {
      points: user?.points || 0,
      scans: scanCount?.c || 0,
      streak: "0d",
      rank: topCount > 0 ? `#${topCount + 1}` : "—",
    }
  }

  return (
    <main className="flex flex-1 flex-col items-center px-4 pb-24 pt-6">
      <div className="flex w-full max-w-lg flex-col items-center">
        <h1 className="font-serif text-2xl font-semibold text-forest dark:text-leaf">EcosysAI</h1>
        <p className="mt-1 text-sm text-muted">
          {session?.user?.name ? `Welcome back, ${session.user.name}` : "Scan. Sort. Earn."}
        </p>

        <div className="mt-6 flex w-full flex-col items-center rounded-3xl bg-card p-6 shadow-sm ring-1 ring-card-border">
          <TreeAnimation points={userStats.points} />
          <p className="mt-2 text-center text-xs text-muted">
            {userStats.points} points — next stage at {userStats.points < 50 ? 50 : userStats.points < 150 ? 150 : userStats.points < 350 ? 350 : userStats.points < 700 ? 700 : "max!"}
          </p>
        </div>

        <div className="mt-6 grid w-full grid-cols-2 gap-3">
          {[
            { icon: Camera, label: "Scans Today", value: String(userStats.scans) },
            { icon: Leaf, label: "Points Earned", value: String(userStats.points) },
            { icon: TrendingUp, label: "Streak", value: userStats.streak },
            { icon: Users, label: "Global Rank", value: userStats.rank },
          ].map(({ icon: Icon, label, value }) => (
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
