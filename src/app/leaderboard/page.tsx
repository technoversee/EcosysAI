import { Trophy, Sparkles } from "lucide-react"

const topThree = [
  { rank: 2, name: "—", points: 0 },
  { rank: 1, name: "—", points: 0 },
  { rank: 3, name: "—", points: 0 },
]

const dummyUsers = Array.from({ length: 5 }).map(() => ({ name: "—", points: 0, scans: 0 }))

export default function LeaderboardPage() {
  return (
    <main className="page">
      <div className="page-inner">
        {/* Header */}
        <div className="w-full">
          <div className="mb-1 inline-flex items-center gap-2 rounded-full bg-clay/8 px-3.5 py-1.5 text-xs font-medium text-clay">
            <Trophy size={12} />
            This Week
          </div>
          <h1 className="font-serif text-xl font-semibold tracking-tight text-pine md:text-2xl lg:text-3xl">Leaderboard</h1>
          <p className="mt-1 text-sm text-warm-grey md:text-base">Top recyclers ranked by points</p>
        </div>

        {/* Podium — responsive spacing */}
        <div className="flex w-full items-end justify-center gap-3 md:gap-5 lg:gap-6">
          {topThree.map(({ rank, name, points }) => {
            const isFirst = rank === 1
            return (
              <div
                key={rank}
                className={`flex flex-col items-center card px-5 pt-5 pb-3 md:px-6 md:pt-6 md:pb-4 ${
                  isFirst ? "scale-110 ring-clay/20 shadow-lg" : "scale-90 opacity-80"
                }`}
              >
                <span className="text-xl md:text-2xl">{rank === 1 ? "🥇" : rank === 2 ? "🥈" : "🥉"}</span>
                <div className="mt-1.5 flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-pine/20 to-sage/20 text-sm font-bold text-pine md:h-10 md:w-10">
                  ?
                </div>
                <p className="mt-1 text-xs font-medium md:text-sm">{name}</p>
                <p className="font-serif text-xs font-bold text-pine md:text-sm">{points} pts</p>
              </div>
            )
          })}
        </div>

        {/* List */}
        <div className="w-full space-y-2">
          {dummyUsers.length === 0 ? (
            <div className="card flex flex-col items-center gap-3 p-8 text-center md:p-10">
              <Sparkles size={20} className="text-warm-grey" />
              <p className="text-sm text-warm-grey">No one has scanned yet. Be the first!</p>
            </div>
          ) : (
            dummyUsers.map((user, i) => (
              <div key={i} className="card flex items-center gap-3 px-4 py-3 hover:ring-pine/15 md:px-5 md:py-3.5">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-pine/8 text-xs font-bold text-pine md:h-8 md:w-8">
                  {i + 4}
                </span>
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sage/15 text-sm md:h-10 md:w-10">
                  ?
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium md:text-base">{user.name}</p>
                  <p className="text-xs text-warm-grey">{user.scans} scans</p>
                </div>
                <span className="font-serif text-sm font-bold text-pine md:text-base">{user.points}</span>
              </div>
            ))
          )}
        </div>

        {dummyUsers.length > 0 && (
          <p className="text-center text-xs text-warm-grey md:text-sm">Scan waste to appear on the leaderboard</p>
        )}
      </div>
    </main>
  )
}
