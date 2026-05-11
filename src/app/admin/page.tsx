import { Shield, Check, X, Sparkles } from "lucide-react"

const dummyProofs = Array.from({ length: 3 }).map((_, i) => ({
  id: i + 1,
  user: `User ${i + 1}`,
  material: ["Plastic", "Glass", "Paper"][i],
  status: "Pending" as const,
}))

export default function AdminPage() {
  return (
    <main className="page">
      <div className="page-inner">
        {/* Header */}
        <div className="w-full">
          <div className="mb-1 inline-flex items-center gap-2 rounded-full bg-clay/8 px-3.5 py-1.5 text-xs font-medium text-clay">
            <Shield size={12} />
            Admin
          </div>
          <h1 className="font-serif text-xl font-semibold tracking-tight text-pine md:text-2xl lg:text-3xl">Judge Panel</h1>
          <p className="mt-1 text-sm text-warm-grey md:text-base">Verify consistency photos & award bonus points</p>
        </div>

        {dummyProofs.length === 0 ? (
          <div className="w-full card flex flex-col items-center gap-3 p-8 text-center md:p-10">
            <Sparkles size={24} className="text-warm-grey" />
            <p className="text-sm text-warm-grey">No pending verifications.</p>
          </div>
        ) : (
          /* Responsive grid for proof cards */
          <div className="grid w-full gap-3 md:grid-cols-2 md:gap-4 lg:grid-cols-3">
            {dummyProofs.map((proof) => (
              <div key={proof.id} className="card overflow-hidden hover:ring-pine/15">
                <div className="flex items-center justify-between px-4 pt-4 pb-2 md:px-5 md:pt-5">
                  <div>
                    <p className="text-sm font-medium md:text-base">{proof.user}</p>
                    <p className="text-xs text-warm-grey">{proof.material} — today</p>
                  </div>
                  <span className="rounded-full bg-clay/8 px-3 py-1 text-xs font-medium text-clay">{proof.status}</span>
                </div>

                <div className="mx-4 flex aspect-video items-center justify-center rounded-xl bg-sage/8 text-sm text-warm-grey md:mx-5">
                  [Proof Photo]
                </div>

                <div className="flex gap-2 p-4 md:p-5">
                  <button className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-success/85 py-2.5 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:bg-success active:scale-[0.98] md:py-3">
                    <Check size={15} /> Approve
                  </button>
                  <button className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-card-border bg-card/40 py-2.5 text-sm font-medium text-warm-grey backdrop-blur-sm transition-all duration-200 hover:border-danger/25 hover:bg-danger/5 hover:text-danger md:py-3">
                    <X size={15} /> Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <p className="text-center text-xs text-warm-grey md:text-sm">
          +5 points per approved proof (once per user per day)
        </p>
      </div>
    </main>
  )
}
