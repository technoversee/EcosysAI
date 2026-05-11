import { Crown, Medal, Sparkles } from "lucide-react"

const topThree = [
  { rank: 2, name: "—", points: 0, emoji: "🥈" },
  { rank: 1, name: "—", points: 0, emoji: "🥇" },
  { rank: 3, name: "—", points: 0, emoji: "🥉" },
]

const dummyUsers = Array.from({ length: 5 }).map((_, i) => ({
  name: "—",
  points: 0,
  scans: 0,
}))

export default function LeaderboardPage() {
  return (
    <main className="flex flex-1 flex-col items-center px-5 pb-28 pt-4">
      <div className="flex w-full max-w-lg flex-col items-center">
        {/* Header */}
        <div className="relative w-full overflow-hidden rounded-3xl bg-gradient-to-b from-amber/10 via-amber/5 to-transparent p-8 text-center">
          <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-amber/5 blur-3xl" />
          <div className="relative">
            <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-2xl bg-amber/10">
              <Crown size={18} className="text-amber" />
            </div>
            <h1 className="font-serif text-2xl font-semibold tracking-tight text-forest dark:text-leaf">
              Leaderboard
            </h1>
            <p className="mt-1.5 text-sm text-muted">Top recyclers this week</p>
          </div>
        </div>

        {/* Podium */}
        <div className="mt-6 flex w-full items-end justify-center gap-3">
          {topThree.map(({ rank, name, points, emoji }) => {
            const isFirst = rank === 1
            return (
              <div
                key={rank}
                className={`flex flex-col items-center rounded-2xl bg-card/70 p-4 shadow-sm ring-1 ring-card-border backdrop-blur-lg transition-all ${
                  isFirst
                    ? "scale-110 ring-amber/20"
                    : "scale-90 opacity-80"
                }`}
              >
                <span className="text-2xl">{emoji}</span>
                <div className="mt-1.5 flex h-10 w-10 items-center justify-center rounded-full bg-sage/20 text-lg">
                  ?
                </div>
                <p className="mt-1 text-xs font-medium">{name}</p>
                <p className="font-serif text-sm font-bold text-forest dark:text-leaf">{points} pts</p>
              </div>
            )
          })}
        </div>

        {/* List */}
        <div className="mt-6 w-full space-y-2">
          {dummyUsers.length === 0 ? (
            <div className="flex flex-col items-center gap-3 rounded-2xl bg-card/60 p-8 text-center ring-1 ring-card-border backdrop-blur-sm">
              <Sparkles size={20} className="text-muted" />
              <p className="text-sm text-muted">No one has scanned yet. Be the first!</p>
            </div>
          ) : (
            dummyUsers.map((user, i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-2xl bg-card/60 px-4 py-3 shadow-sm ring-1 ring-card-border backdrop-blur-sm transition-all duration-200 hover:ring-forest/20"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-forest/10 text-xs font-bold text-forest dark:bg-leaf/10 dark:text-leaf">
                  {i + 4}
                </span>
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sage/20 text-sm">
                  ?
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-muted">{user.scans} scans</p>
                </div>
                <span className="font-serif text-sm font-bold text-forest dark:text-leaf">{user.points} pts</span>
              </div>
            ))
          )}
        </div>

        {dummyUsers.length > 0 && (
          <p className="mt-6 text-center text-xs text-muted">Scan waste to appear on the leaderboard!</p>
        )}
      </div>
    </main>
  )
}
