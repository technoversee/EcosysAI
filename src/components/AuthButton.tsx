"use client"

import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { LogIn, LogOut } from "lucide-react"

export default function AuthButton() {
  const { data: session } = useSession()
  const router = useRouter()

  if (session?.user) {
    return (
      <div className="flex items-center gap-2">
        <span className="hidden text-xs text-muted sm:inline">{session.user.name}</span>
        <button
          onClick={() => signOut()}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted transition-colors hover:bg-forest/10 hover:text-forest"
          title="Sign out"
        >
          <LogOut size={15} />
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => router.push("/login")}
      className="flex items-center gap-1.5 rounded-full bg-forest/10 px-3 py-1.5 text-xs font-medium text-forest transition-colors hover:bg-forest/20 dark:text-leaf"
    >
      <LogIn size={13} />
      Sign in
    </button>
  )
}
