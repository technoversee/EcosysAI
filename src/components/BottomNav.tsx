"use client"

import { Home, Scan, Trophy, Gift, User } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const NAV_ITEMS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/scan", label: "Scan", icon: Scan },
  { href: "/leaderboard", label: "Rankings", icon: Trophy },
  { href: "/rewards", label: "Rewards", icon: Gift },
  { href: "/profile", label: "Profile", icon: User },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-card-border bg-card/60 backdrop-blur-xl">
      <div className="mx-auto flex max-w-md items-center justify-around px-2 py-1">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "relative flex flex-col items-center gap-0.5 rounded-xl px-3.5 py-1.5 text-[0.7rem] font-medium transition-all duration-200",
                active
                  ? "text-pine"
                  : "text-warm-grey hover:text-fg"
              )}
            >
              {active && (
                <span className="absolute -top-px left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full bg-pine" />
              )}
              <Icon
                size={20}
                strokeWidth={active ? 2.5 : 1.5}
                className={active ? "drop-shadow-sm" : ""}
              />
              <span className={active ? "font-semibold" : ""}>{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
