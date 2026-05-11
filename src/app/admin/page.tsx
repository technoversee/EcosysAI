"use client"

import { useState, useEffect } from "react"
import { Shield, Check, X, Clock, AlertCircle, Sparkles } from "lucide-react"

interface Proof { id: string; user_name: string; status: string; created_at: string }

export default function AdminPage() {
  const [proofs, setProofs] = useState<Proof[]>([])
  const [loading, setLoading] = useState(true)
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null)

  async function load() {
    setLoading(true)
    try { const r = await fetch("/api/proofs"); setProofs((await r.json()).proofs || []) }
    catch { setProofs([]) }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  async function handleAction(id: string, action: "approved" | "rejected") {
    setMsg(null)
    try {
      const res = await fetch(`/api/proofs/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action }) })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setMsg({ type: "success", text: `Proof ${action}!` }); load()
    } catch (e: any) { setMsg({ type: "error", text: e.message }) }
  }

  const pending = proofs.filter((p) => p.status === "pending")

  return (
    <main className="page">
      <div className="page-inner">
        <div className="w-full">
          <div className="mb-1 inline-flex items-center gap-2 rounded-full bg-clay/8 px-3.5 py-1.5 text-xs font-medium text-clay"><Shield size={12} /> Admin</div>
          <h1 className="font-serif text-xl font-semibold tracking-tight text-pine md:text-2xl lg:text-3xl">Judge Panel</h1>
          <p className="mt-1 text-sm text-warm-grey md:text-base">Verify photos & award bonus points</p>
        </div>

        <div className="inline-flex items-center gap-2 rounded-full bg-clay/8 px-3 py-1 text-xs font-medium text-clay"><Clock size={12} /> {loading ? "..." : pending.length} pending</div>

        {msg && (
          <div className={`flex w-full items-center gap-2 rounded-xl px-4 py-2.5 text-sm ${msg.type === "success" ? "bg-success/10 text-success" : "bg-danger/10 text-danger"}`}>
            {msg.type === "success" ? <Check size={16} /> : <AlertCircle size={16} />} {msg.text}
          </div>
        )}

        {loading ? (
          <p className="text-sm text-warm-grey">Loading...</p>
        ) : pending.length === 0 ? (
          <div className="w-full card flex flex-col items-center gap-3 p-8 text-center md:p-10">
            <Sparkles size={24} className="text-warm-grey" />
            <p className="text-sm text-warm-grey">All caught up! No pending verifications.</p>
          </div>
        ) : (
          <div className="grid w-full gap-3 md:grid-cols-2 md:gap-4 lg:grid-cols-3">
            {pending.map((p) => (
              <div key={p.id} className="card overflow-hidden hover:ring-pine/15">
                <div className="flex items-center justify-between px-4 pt-4 pb-2 md:px-5 md:pt-5">
                  <div>
                    <p className="text-sm font-medium md:text-base">{p.user_name}</p>
                    <p className="text-xs text-warm-grey">{new Date(p.created_at).toLocaleDateString()}</p>
                  </div>
                  <span className="rounded-full bg-clay/8 px-3 py-1 text-xs font-medium text-clay">{p.status}</span>
                </div>
                <div className="mx-4 flex aspect-video items-center justify-center rounded-xl bg-sage/8 text-sm text-warm-grey md:mx-5">[Proof Photo]</div>
                <div className="flex gap-2 p-4 md:p-5">
                  <button onClick={() => handleAction(p.id, "approved")} className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-success/85 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-success active:scale-[0.98] md:py-3"><Check size={15} /> Approve</button>
                  <button onClick={() => handleAction(p.id, "rejected")} className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-card-border bg-card/40 py-2.5 text-sm font-medium text-warm-grey backdrop-blur-sm transition-all hover:border-danger/25 hover:bg-danger/5 hover:text-danger md:py-3"><X size={15} /> Reject</button>
                </div>
              </div>
            ))}
          </div>
        )}

        <p className="text-center text-xs text-warm-grey md:text-sm">+5 points per approved proof (once per user per day)</p>
      </div>
    </main>
  )
}
