"use client"

import { Home, Scan, Trophy, Gift, User } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const NAV = [
  { href: "/", label: "Home", icon: Home },
  { href: "/scan", label: "Scan", icon: Scan },
  { href: "/leaderboard", label: "Rank", icon: Trophy },
  { href: "/rewards", label: "Rewards", icon: Gift },
  { href: "/profile", label: "Profile", icon: User },
]

export default function BottomNav() {
  const p = usePathname()
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-surface/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-sm items-center justify-around px-2">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = p === href
          return (
            <Link key={href} href={href} className="relative flex flex-col items-center gap-0.5 px-4 py-2">
              {active && <span className="absolute top-0 left-1/2 h-0.5 w-5 -translate-x-1/2 rounded-full bg-primary" />}
              <Icon size={20} strokeWidth={active ? 2.5 : 1.5} className={active ? "text-primary" : "text-muted"} />
              <span className={`text-[10px] font-medium ${active ? "text-primary" : "text-muted"}`}>{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
