import { Shield, Check, X, Sparkles } from "lucide-react"

const dummyProofs = Array.from({ length: 3 }).map((_, i) => ({
  id: i + 1,
  user: `User ${i + 1}`,
  material: ["Plastic", "Glass", "Paper"][i],
  status: "Pending" as const,
}))

export default function AdminPage() {
  return (
    <main className="flex flex-1 flex-col items-center px-5 pb-28 pt-4">
      <div className="flex w-full max-w-lg flex-col items-center">
        {/* Header */}
        <div className="relative w-full overflow-hidden rounded-3xl bg-gradient-to-b from-amber/10 via-amber/5 to-transparent p-8 text-center">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-amber/5 blur-3xl" />
          <div className="relative flex items-center justify-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber/10">
              <Shield size={18} className="text-amber" />
            </div>
            <h1 className="font-serif text-2xl font-semibold tracking-tight text-forest dark:text-leaf">
              Judge Panel
            </h1>
          </div>
          <p className="relative mt-1.5 text-sm text-muted">Verify consistency photos & award bonus points</p>
        </div>

        {dummyProofs.length === 0 ? (
          <div className="mt-8 flex w-full flex-col items-center gap-3 rounded-2xl bg-card/60 p-8 text-center ring-1 ring-card-border backdrop-blur-sm">
            <Sparkles size={24} className="text-muted" />
            <p className="text-sm text-muted">No pending verifications.</p>
          </div>
        ) : (
          <div className="mt-6 w-full space-y-3">
            {dummyProofs.map((proof) => (
              <div
                key={proof.id}
                className="overflow-hidden rounded-2xl bg-card/70 shadow-sm ring-1 ring-card-border backdrop-blur-lg transition-all duration-200 hover:ring-forest/20"
              >
                <div className="flex items-center justify-between p-4 pb-0">
                  <div>
                    <p className="text-sm font-medium">{proof.user}</p>
                    <p className="text-xs text-muted">{proof.material} waste — today</p>
                  </div>
                  <span className="rounded-full bg-amber/10 px-3 py-1 text-xs font-medium text-amber-700 dark:text-amber-300">
                    {proof.status}
                  </span>
                </div>

                <div className="mx-4 mt-3 flex aspect-video items-center justify-center rounded-xl bg-sage/10 text-sm text-muted">
                  [Proof Photo]
                </div>

                <div className="flex gap-2 p-4">
                  <button className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-success/90 py-2.5 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:bg-success active:scale-[0.98]">
                    <Check size={16} /> Approve
                  </button>
                  <button className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-card-border bg-card/50 py-2.5 text-sm font-medium text-muted backdrop-blur-sm transition-all duration-200 hover:border-danger/30 hover:bg-danger/5 hover:text-danger">
                    <X size={16} /> Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <p className="mt-6 text-center text-xs text-muted">
          Bonus: +5 points per approved proof (once per user per day)
        </p>
      </div>
    </main>
  )
}
