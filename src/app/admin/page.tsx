"use client"

import { useState, useEffect } from "react"
import { Shield, Check, X, Clock, AlertCircle } from "lucide-react"

interface Proof {
  id: string
  user_name: string
  status: string
  created_at: string
}

export default function AdminPage() {
  const [proofs, setProofs] = useState<Proof[]>([])
  const [loading, setLoading] = useState(true)
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null)

  async function load() {
    setLoading(true)
    try {
      const res = await fetch("/api/proofs")
      const data = await res.json()
      setProofs(data.proofs || [])
    } catch {
      setProofs([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  async function handleAction(id: string, action: "approved" | "rejected") {
    setMsg(null)
    try {
      const res = await fetch(`/api/proofs/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setMsg({ type: "success", text: `Proof ${action}!` })
      load()
    } catch (e: any) {
      setMsg({ type: "error", text: e.message })
    }
  }

  const pending = proofs.filter((p) => p.status === "pending")

  return (
    <main className="flex flex-1 flex-col items-center px-4 pb-24 pt-6">
      <div className="flex w-full max-w-lg flex-col items-center">
        <div className="flex items-center gap-2">
          <Shield size={22} className="text-forest dark:text-leaf" />
          <h1 className="font-serif text-2xl font-semibold text-forest dark:text-leaf">Judge Panel</h1>
        </div>
        <p className="mt-1 text-sm text-muted">Verify consistency photos & award bonus points</p>

        <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
          <Clock size={12} />
          {pending.length} pending
        </div>

        {msg && (
          <div className={`mt-3 flex w-full items-center gap-2 rounded-xl px-4 py-2.5 text-sm ${
            msg.type === "success" ? "bg-success/10 text-success" : "bg-danger/10 text-danger"
          }`}>
            {msg.type === "success" ? <Check size={16} /> : <AlertCircle size={16} />}
            {msg.text}
          </div>
        )}

        {loading ? (
          <p className="mt-8 text-sm text-muted">Loading...</p>
        ) : pending.length === 0 ? (
          <div className="mt-8 flex flex-col items-center gap-3 rounded-2xl bg-card p-8 text-center ring-1 ring-card-border">
            <Shield size={28} className="text-muted" />
            <p className="text-sm text-muted">All caught up! No pending verifications.</p>
          </div>
        ) : (
          <div className="mt-6 w-full space-y-3">
            {pending.map((proof) => (
              <div key={proof.id} className="rounded-2xl bg-card p-4 shadow-sm ring-1 ring-card-border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{proof.user_name}</p>
                    <p className="text-xs text-muted">{new Date(proof.created_at).toLocaleDateString()}</p>
                  </div>
                  <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                    {proof.status}
                  </span>
                </div>

                <div className="mt-3 flex aspect-video w-full items-center justify-center rounded-xl bg-sage/10 text-sm text-muted">
                  [Proof Photo]
                </div>

                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => handleAction(proof.id, "approved")}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-success py-2 text-sm font-medium text-white transition-colors hover:bg-green-600 active:scale-[0.98]"
                  >
                    <Check size={16} /> Approve
                  </button>
                  <button
                    onClick={() => handleAction(proof.id, "rejected")}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-full border border-card-border py-2 text-sm font-medium text-muted transition-colors hover:bg-danger/10 hover:text-danger active:scale-[0.98]"
                  >
                    <X size={16} /> Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <p className="mt-6 text-center text-xs text-muted">
          +5 points per approved proof (once per user per day)
        </p>
      </div>
    </main>
  )
}
