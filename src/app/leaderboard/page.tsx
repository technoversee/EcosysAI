import { Crown, Medal, Trophy } from "lucide-react"

const topThree = [
  { rank: 2, name: "—", points: 0, emoji: "🥈" },
  { rank: 1, name: "—", points: 0, emoji: "🥇" },
  { rank: 3, name: "—", points: 0, emoji: "🥉" },
]

const dummyUsers = [
  { name: "—", points: 0, scans: 0 },
  { name: "—", points: 0, scans: 0 },
  { name: "—", points: 0, scans: 0 },
]

export default function LeaderboardPage() {
  return (
    <main className="flex flex-1 flex-col items-center px-4 pb-24 pt-6">
      <div className="flex w-full max-w-lg flex-col items-center">
        <h1 className="font-serif text-2xl font-semibold text-forest dark:text-leaf">Leaderboard</h1>
        <p className="mt-1 text-sm text-muted">Top recyclers this week</p>

        <div className="mt-6 flex w-full items-end justify-center gap-3">
          {topThree.map(({ rank, name, points, emoji }) => {
            const isFirst = rank === 1
            return (
              <div
                key={rank}
                className={`flex flex-col items-center rounded-2xl bg-card p-4 shadow-sm ring-1 ring-card-border ${
                  isFirst ? "mb-0 scale-110" : "mb-4 scale-90"
                }`}
              >
                <span className="text-2xl">{emoji}</span>
                <div className="mt-1 h-8 w-8 rounded-full bg-sage/50" />
                <p className="mt-1 text-xs font-medium">{name}</p>
                <p className="font-serif text-sm font-bold text-forest dark:text-leaf">{points} pts</p>
              </div>
            )
          })}
        </div>

        <div className="mt-6 w-full space-y-2">
          {dummyUsers.map((user, i) => (
            <div
              key={i}
              className="flex items-center gap-3 rounded-xl bg-card px-4 py-3 shadow-sm ring-1 ring-card-border"
            >
              <span className="w-6 text-center text-sm font-bold text-muted">{i + 4}</span>
              <div className="h-8 w-8 rounded-full bg-sage/50" />
              <div className="flex-1">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-muted">{user.scans} scans</p>
              </div>
              <span className="font-serif text-sm font-bold text-forest dark:text-leaf">{user.points} pts</span>
            </div>
          ))}
        </div>

        <p className="mt-6 text-sm text-muted">Scan waste to appear on the leaderboard!</p>
      </div>
    </main>
  )
}
