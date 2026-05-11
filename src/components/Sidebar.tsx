"use client"

import { Home, Scan, Trophy, Gift, User, Settings, Leaf } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const ITEMS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/scan", label: "Scan", icon: Scan },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { href: "/rewards", label: "Rewards", icon: Gift },
  { href: "/profile", label: "Profile", icon: User },
  { href: "/admin", label: "Admin", icon: Settings },
]

export default function Sidebar() {
  const p = usePathname()

  return (
    <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-60 lg:flex-col lg:border-r lg:border-card-border lg:bg-bg/95 lg:z-40">
      <div className="flex items-center gap-3 px-6 pt-7 pb-9">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-pine to-pine-light text-sm shadow-sm">🌱</span>
        <div>
          <p className="font-serif text-base font-semibold tracking-tight text-pine">EcosysAI</p>
          <p className="text-[10px] text-warm-grey">Scan. Sort. Earn.</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {ITEMS.map(({ href, label, icon: Icon }) => {
          const active = p === href
          return (
            <Link
              key={href}
              href={href}
              className={`group flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                active ? "bg-pine/10 text-pine shadow-sm" : "text-warm-grey hover:bg-pine/5 hover:text-pine"
              }`}
            >
              <Icon size={18} strokeWidth={active ? 2.5 : 1.5} />
              <span>{label}</span>
              {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-pine" />}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-card-border px-3 py-4">
        <div className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm text-warm-grey">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-pine/20 to-sage/20 text-xs font-bold text-pine">?</div>
          <div className="flex-1">
            <p className="text-xs font-medium text-pine">Guest</p>
            <p className="text-[10px] text-warm-grey">Not signed in</p>
          </div>
          <Leaf size={14} className="text-pine/40" />
        </div>
      </div>
    </aside>
  )
}
