"use client"

import { signIn } from "next-auth/react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Leaf, Loader2 } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    setError(null)

    const res = await signIn("credentials", {
      email,
      name,
      redirect: false,
    })

    if (res?.error) {
      setError("Sign in failed")
      setLoading(false)
    } else {
      router.push("/")
      router.refresh()
    }
  }

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 pb-24 pt-10">
      <div className="flex w-full max-w-sm flex-col items-center">
        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-forest shadow-lg">
          <Leaf size={28} className="text-white" />
        </div>
        <h1 className="font-serif text-2xl font-semibold text-forest dark:text-leaf">Sign In</h1>
        <p className="mt-1 text-sm text-muted">Start tracking your recycling impact</p>

        <form onSubmit={handleSubmit} className="mt-8 flex w-full flex-col gap-4">
          <div>
            <label className="text-xs font-medium text-muted">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="mt-1 w-full rounded-xl border border-card-border bg-card px-4 py-3 text-sm outline-none transition-colors focus:border-forest focus:ring-2 focus:ring-forest/20"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted">Name (optional)</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="mt-1 w-full rounded-xl border border-card-border bg-card px-4 py-3 text-sm outline-none transition-colors focus:border-forest focus:ring-2 focus:ring-forest/20"
            />
          </div>

          {error && <p className="text-sm text-danger">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-forest px-6 py-3 font-medium text-white shadow-lg transition-all hover:bg-forest-light disabled:opacity-60 active:scale-[0.98]"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : null}
            {loading ? "Signing in..." : "Sign in / Register"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-muted">
          No password needed. Enter your email to sign in or create an account.
        </p>
      </div>
    </main>
  )
}
