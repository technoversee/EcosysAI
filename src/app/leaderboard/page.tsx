import { Trophy, Sparkles } from "lucide-react"
import { getDb } from "@/lib/db"

export const dynamic = "force-dynamic"

export default function LeaderboardPage() {
  const db = getDb()
  const users = db
    .prepare(`SELECT u.id, u.name, u.email, u.image, u.points, (SELECT COUNT(*) FROM scans s WHERE s.user_id = u.id) AS scans FROM users u ORDER BY u.points DESC LIMIT 50`)
    .all() as { id: string; name: string; email: string; points: number; scans: number }[]

  const top = users.slice(0, 3)
  const rest = users.slice(3)

  return (
    <main className="page">
      <div className="page-inner">
        <div className="w-full">
          <div className="mb-1 inline-flex items-center gap-2 rounded-full bg-clay/8 px-3.5 py-1.5 text-xs font-medium text-clay">
            <Trophy size={12} /> This Week
          </div>
          <h1 className="font-serif text-xl font-semibold tracking-tight text-pine md:text-2xl lg:text-3xl">Leaderboard</h1>
          <p className="mt-1 text-sm text-warm-grey md:text-base">Top recyclers ranked by points</p>
        </div>

        {users.length === 0 ? (
          <div className="w-full card flex flex-col items-center gap-3 p-8 text-center md:p-10">
            <Sparkles size={20} className="text-warm-grey" />
            <p className="text-sm text-warm-grey">No recyclers yet. Be the first to scan!</p>
          </div>
        ) : (
          <>
            <div className="flex w-full items-end justify-center gap-3 md:gap-5 lg:gap-6">
              {[1, 0, 2].map((idx) => {
                const u = top[idx]
                if (!u) return null
                const isFirst = idx === 0
                return (
                  <div key={u.id} className={`flex flex-col items-center card px-5 pt-5 pb-3 md:px-6 md:pt-6 md:pb-4 ${isFirst ? "scale-110 ring-clay/20 shadow-lg" : "scale-90 opacity-80"}`}>
                    <span className="text-xl md:text-2xl">{idx === 0 ? "🥇" : idx === 1 ? "🥈" : "🥉"}</span>
                    <div className="mt-1.5 flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-pine/20 to-sage/20 text-sm font-bold text-pine md:h-10 md:w-10">{u.name?.charAt(0) || "?"}</div>
                    <p className="mt-1 text-xs font-medium md:text-sm">{u.name || "Anonymous"}</p>
                    <p className="font-serif text-xs font-bold text-pine md:text-sm">{u.points} pts</p>
                  </div>
                )
              })}
            </div>

            <div className="w-full space-y-2">
              {rest.map((u, i) => (
                <div key={u.id} className="card flex items-center gap-3 px-4 py-3 hover:ring-pine/15 md:px-5 md:py-3.5">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-pine/8 text-xs font-bold text-pine md:h-8 md:w-8">{i + 4}</span>
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sage/15 text-sm md:h-10 md:w-10">{u.name?.charAt(0) || "?"}</div>
                  <div className="flex-1">
                    <p className="text-sm font-medium md:text-base">{u.name || "Anonymous"}</p>
                    <p className="text-xs text-warm-grey">{u.scans} scans</p>
                  </div>
                  <span className="font-serif text-sm font-bold text-pine md:text-base">{u.points}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  )
}
