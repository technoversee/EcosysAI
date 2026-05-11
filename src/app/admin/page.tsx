import { Shield, Check, X } from "lucide-react"

const PROOFS = Array.from({ length: 3 }).map((_, i) => ({
  id: i + 1,
  user: `User ${i + 1}`,
  material: ["Plastic", "Glass", "Paper"][i],
  status: "Pending" as const,
}))

export default function AdminPage() {
  return (
    <main className="page">
      <div className="page-inner">
        <div className="w-full">
          <p className="mb-1 text-xs font-medium text-accent">Admin</p>
          <h1 className="font-serif text-2xl font-semibold tracking-tight text-primary">Judge Panel</h1>
          <p className="mt-1 text-sm text-muted">Verify photos & award bonus points</p>
        </div>

        {PROOFS.length === 0 ? (
          <div className="w-full card flex flex-col items-center gap-3 p-8 text-center">
            <p className="text-sm text-muted">No pending verifications.</p>
          </div>
        ) : (
          <div className="w-full space-y-3">
            {PROOFS.map((p) => (
              <div key={p.id} className="card overflow-hidden">
                <div className="flex items-center justify-between px-4 pt-4 pb-2">
                  <div>
                    <p className="text-sm font-medium">{p.user}</p>
                    <p className="text-xs text-muted">{p.material} — today</p>
                  </div>
                  <span className="rounded-full bg-accent/8 px-3 py-1 text-xs font-medium text-accent">{p.status}</span>
                </div>

                <div className="mx-4 flex aspect-video items-center justify-center rounded-xl bg-primary/6 text-sm text-muted">
                  [Photo]
                </div>

                <div className="flex gap-2 p-4">
                  <button className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-success/85 py-2.5 text-sm font-medium text-white transition-all active:scale-[0.97]">
                    <Check size={15} /> Approve
                  </button>
                  <button className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-border bg-surface/40 py-2.5 text-sm font-medium text-muted transition-all hover:border-danger/25 hover:text-danger active:scale-[0.97]">
                    <X size={15} /> Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <p className="text-xs text-muted">+5 pts per approved proof (once per user per day)</p>
      </div>
    </main>
  )
}
