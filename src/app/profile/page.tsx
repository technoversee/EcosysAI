import { Settings, History, Globe } from "lucide-react"
import TreeAnimation from "@/components/TreeAnimation"
import { getDb } from "@/lib/db"
import { auth } from "@/lib/auth"

export const dynamic = "force-dynamic"

export default async function ProfilePage() {
  const session = await auth()
  const db = getDb()

  let user = { name: "Guest", points: 0, scans: 0 }
  if (session?.user?.id) {
    const u = db.prepare("SELECT name, points FROM users WHERE id = ?").get(session.user.id) as any
    const sc = db.prepare("SELECT COUNT(*) as c FROM scans WHERE user_id = ?").get(session.user.id) as any
    if (u) user = { name: u.name || "User", points: u.points, scans: sc?.c || 0 }
  }

  return (
    <main className="flex flex-1 flex-col items-center px-4 pb-24 pt-6">
      <div className="flex w-full max-w-lg flex-col items-center">
        <div className="flex items-center gap-3">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-forest text-xl font-bold text-white">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="font-serif text-xl font-semibold text-forest dark:text-leaf">{user.name}</h1>
            <p className="text-sm text-muted">
              {session?.user ? `${user.points} points` : "Sign in to save your progress"}
            </p>
          </div>
        </div>

        <div className="mt-6 flex w-full items-center justify-center rounded-3xl bg-card p-6 shadow-sm ring-1 ring-card-border">
          <TreeAnimation points={user.points} />
        </div>

        <div className="mt-4 grid w-full grid-cols-3 gap-3">
          {[
            { label: "Total Scans", value: String(user.scans) },
            { label: "Total Points", value: String(user.points) },
            { label: "Badges", value: user.points >= 50 ? "1" : "0" },
          ].map(({ label, value }) => (
            <div key={label} className="flex flex-col items-center rounded-xl bg-card p-3 shadow-sm ring-1 ring-card-border">
              <span className="font-serif text-lg font-bold text-forest dark:text-leaf">{value}</span>
              <span className="text-xs text-muted">{label}</span>
            </div>
          ))}
        </div>

        <div className="mt-6 w-full space-y-2">
          {[
            { icon: History, label: "Scan History", desc: "View your past scans" },
            { icon: Globe, label: "Language", desc: "English / हिन्दी" },
            { icon: Settings, label: "Settings", desc: "App preferences" },
          ].map(({ icon: Icon, label, desc }) => (
            <button
              key={label}
              className="flex w-full items-center gap-3 rounded-xl bg-card px-4 py-3 text-left shadow-sm ring-1 ring-card-border transition-colors hover:ring-forest"
            >
              <Icon size={20} className="text-forest dark:text-leaf" />
              <div className="flex-1">
                <p className="text-sm font-medium">{label}</p>
                <p className="text-xs text-muted">{desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </main>
  )
}
