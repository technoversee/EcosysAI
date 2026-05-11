import { Trophy, Users } from "lucide-react"

const TOP = [
  { rank: 2, name: "—", pts: 0 },
  { rank: 1, name: "—", pts: 0 },
  { rank: 3, name: "—", pts: 0 },
]

const LIST = Array.from({ length: 5 }).map(() => ({ name: "—", pts: 0, scans: 0 }))

export default function LeaderboardPage() {
  return (
    <main className="page">
      <div className="page-inner">
        <div className="w-full">
          <p className="mb-1 text-xs font-medium text-accent">This Week</p>
          <h1 className="font-serif text-2xl font-semibold tracking-tight text-primary">Leaderboard</h1>
          <p className="mt-1 text-sm text-muted">Top recyclers ranked by points</p>
        </div>

        {/* podium */}
        <div className="flex w-full items-end justify-center gap-3">
          {TOP.map((r) => {
            const first = r.rank === 1
            return (
              <div
                key={r.rank}
                className={`flex flex-col items-center card px-4 ${
                  first ? "pt-5 pb-4 scale-110 ring-accent/20" : "pt-4 pb-3 scale-90 opacity-80"
                }`}
              >
                <span className="text-lg">{r.rank === 1 ? "🥇" : r.rank === 2 ? "🥈" : "🥉"}</span>
                <div className="mt-1.5 flex h-8 w-8 items-center justify-center rounded-full bg-primary/8 text-xs">?</div>
                <p className="mt-1 text-xs font-medium">{r.name}</p>
                <p className="font-serif text-xs font-bold text-primary">{r.pts}</p>
              </div>
            )
          })}
        </div>

        {/* list */}
        <div className="w-full space-y-2">
          {LIST.map((u, i) => (
            <div key={i} className="card flex items-center gap-3 px-4 py-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/8 text-[11px] font-bold text-primary">
                {i + 4}
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/6 text-xs">?</div>
              <div className="flex-1">
                <p className="text-sm font-medium">{u.name}</p>
                <p className="text-xs text-muted">{u.scans} scans</p>
              </div>
              <span className="font-serif text-sm font-bold text-primary">{u.pts}</span>
            </div>
          ))}
        </div>

        {LIST.length > 0 && <p className="text-xs text-muted">Scan waste to appear on the leaderboard</p>}
      </div>
    </main>
  )
}
