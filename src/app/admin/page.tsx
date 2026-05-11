import { Shield, Check, X } from "lucide-react"

const dummyProofs = Array.from({ length: 3 }).map((_, i) => ({
  id: i + 1,
  user: `User ${i + 1}`,
  material: ["Plastic", "Glass", "Paper"][i],
  status: "Pending" as const,
}))

export default function AdminPage() {
  return (
    <main className="flex flex-1 flex-col items-center px-4 pb-24 pt-6">
      <div className="flex w-full max-w-lg flex-col items-center">
        <div className="flex items-center gap-2">
          <Shield size={22} className="text-forest dark:text-leaf" />
          <h1 className="font-serif text-2xl font-semibold text-forest dark:text-leaf">Judge Panel</h1>
        </div>
        <p className="mt-1 text-sm text-muted">Verify consistency photos & award bonus points</p>

        {dummyProofs.length === 0 ? (
          <p className="mt-12 text-center text-sm text-muted">No pending verifications.</p>
        ) : (
          <div className="mt-6 w-full space-y-3">
            {dummyProofs.map((proof) => (
              <div
                key={proof.id}
                className="rounded-2xl bg-card p-4 shadow-sm ring-1 ring-card-border"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{proof.user}</p>
                    <p className="text-xs text-muted">{proof.material} waste — today</p>
                  </div>
                  <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                    {proof.status}
                  </span>
                </div>

                <div className="mt-3 flex aspect-video w-full items-center justify-center rounded-xl bg-sage/10 text-sm text-muted">
                  [Proof Photo Placeholder]
                </div>

                <div className="mt-3 flex gap-2">
                  <button className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-success py-2 text-sm font-medium text-white transition-colors hover:bg-green-600">
                    <Check size={16} /> Approve
                  </button>
                  <button className="flex flex-1 items-center justify-center gap-1.5 rounded-full border border-card-border py-2 text-sm font-medium text-muted transition-colors hover:bg-danger/10 hover:text-danger">
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
