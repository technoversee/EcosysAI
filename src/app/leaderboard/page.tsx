import { Crown, Medal, Sparkles, Trophy } from "lucide-react"

const topThree = [
  { rank: 2, name: "—", points: 0 },
  { rank: 1, name: "—", points: 0 },
  { rank: 3, name: "—", points: 0 },
]

const dummyUsers = Array.from({ length: 5 }).map((_, i) => ({
  name: "—",
  points: 0,
  scans: 0,
}))

const podiumColors = ["", "ring-clay/20 bg-gradient-to-b from-clay/6 to-transparent", ""]

export default function LeaderboardPage() {
  return (
    <main className="flex flex-1 flex-col items-center px-5 pb-28 pt-6">
      <div className="flex w-full max-w-md flex-col items-center gap-6">
        {/* Header */}
        <div className="w-full">
          <div className="mb-1 inline-flex items-center gap-2 rounded-full bg-clay/8 px-3.5 py-1.5 text-xs font-medium text-clay">
            <Trophy size={12} />
            This Week
          </div>
          <h1 className="font-serif text-xl font-semibold tracking-tight text-pine">Leaderboard</h1>
          <p className="mt-1 text-sm text-warm-grey">Top recyclers ranked by points</p>
        </div>

        {/* Podium */}
        <div className="flex w-full items-end justify-center gap-3">
          {topThree.map(({ rank, name, points }, i) => {
            const isFirst = rank === 1
            const height = isFirst ? "h-32" : rank === 2 ? "h-24" : "h-20"
            return (
              <div
                key={rank}
                className={`flex flex-col items-center rounded-2xl bg-card/60 px-5 pt-5 pb-3 ring-1 ring-card-border backdrop-blur-sm transition-all ${height} justify-between ${
                  isFirst ? "scale-110 ring-clay/20" : "scale-90 opacity-80"
                }`}
              >
                <span className="text-xl">{rank === 1 ? "🥇" : rank === 2 ? "🥈" : "🥉"}</span>
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sage/15 text-sm">
                  ?
                </div>
                <p className="text-xs font-medium">{name}</p>
                <p className="font-serif text-xs font-bold text-pine">{points}</p>
              </div>
            )
          })}
        </div>

        {/* List */}
        <div className="w-full space-y-2">
          {dummyUsers.length === 0 ? (
            <div className="flex flex-col items-center gap-3 rounded-2xl bg-card/50 p-8 text-center ring-1 ring-card-border backdrop-blur-sm">
              <Sparkles size={20} className="text-warm-grey" />
              <p className="text-sm text-warm-grey">No one has scanned yet. Be the first!</p>
            </div>
          ) : (
            dummyUsers.map((user, i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-xl bg-card/55 px-4 py-3 ring-1 ring-card-border backdrop-blur-sm transition-all duration-200 hover:ring-pine/15"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-pine/8 text-xs font-bold text-pine">
                  {i + 4}
                </span>
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sage/15 text-sm">
                  ?
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-warm-grey">{user.scans} scans</p>
                </div>
                <span className="font-serif text-sm font-bold text-pine">{user.points}</span>
              </div>
            ))
          )}
        </div>

        {dummyUsers.length > 0 && (
          <p className="text-center text-xs text-warm-grey">Scan waste to appear on the leaderboard</p>
        )}
      </div>
    </main>
  )
}
