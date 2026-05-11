import { Trophy } from "lucide-react"
import { getDb } from "@/lib/db"

export const dynamic = "force-dynamic"

export default function LeaderboardPage() {
  const db = getDb()
  const users = db
    .prepare(
      `SELECT u.id, u.name, u.email, u.image, u.points,
              (SELECT COUNT(*) FROM scans s WHERE s.user_id = u.id) AS scans
       FROM users u
       ORDER BY u.points DESC
       LIMIT 50`
    )
    .all() as { id: string; name: string; email: string; points: number; scans: number }[]

  const topThree = users.slice(0, 3)
  const rest = users.slice(3)

  return (
    <main className="flex flex-1 flex-col items-center px-4 pb-24 pt-6">
      <div className="flex w-full max-w-lg flex-col items-center">
        <h1 className="font-serif text-2xl font-semibold text-forest dark:text-leaf">Leaderboard</h1>
        <p className="mt-1 text-sm text-muted">Top recyclers this week</p>

        {users.length === 0 ? (
          <p className="mt-12 text-sm text-muted">No recyclers yet. Be the first to scan!</p>
        ) : (
          <>
            {/* Podium */}
            <div className="mt-6 flex w-full items-end justify-center gap-3">
              {[1, 0, 2].map((idx) => {
                const u = topThree[idx]
                if (!u) return null
                const isFirst = idx === 0
                return (
                  <div
                    key={u.id}
                    className={`flex flex-col items-center rounded-2xl bg-card p-4 shadow-sm ring-1 ring-card-border ${
                      isFirst ? "scale-110 ring-amber/20" : "scale-90 opacity-80"
                    }`}
                  >
                    <span className="text-2xl">{idx === 0 ? "🥇" : idx === 1 ? "🥈" : "🥉"}</span>
                    <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-forest/10 text-sm font-bold text-forest">
                      {u.name?.charAt(0) || "?"}
                    </div>
                    <p className="mt-1 text-xs font-medium">{u.name || "Anonymous"}</p>
                    <p className="font-serif text-sm font-bold text-forest dark:text-leaf">{u.points} pts</p>
                  </div>
                )
              })}
            </div>

            {/* List */}
            <div className="mt-6 w-full space-y-2">
              {rest.map((u, i) => (
                <div
                  key={u.id}
                  className="flex items-center gap-3 rounded-xl bg-card px-4 py-3 shadow-sm ring-1 ring-card-border"
                >
                  <span className="w-6 text-center text-sm font-bold text-muted">{i + 4}</span>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-forest/10 text-xs font-bold text-forest">
                    {u.name?.charAt(0) || "?"}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{u.name || "Anonymous"}</p>
                    <p className="text-xs text-muted">{u.scans} scans</p>
                  </div>
                  <span className="font-serif text-sm font-bold text-forest dark:text-leaf">{u.points} pts</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  )
}
