"use client"

import { usePathname } from "next/navigation"
import { ReactNode } from "react"
import BottomNav from "@/components/BottomNav"
import ThemeToggle from "@/components/ThemeToggle"
import AuthButton from "@/components/AuthButton"

export default function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const isFullPage = pathname === "/" || pathname === "/login"

  if (isFullPage) {
    return <>{children}</>
  }

  return (
    <>
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-card-border bg-card/80 px-4 py-2.5 backdrop-blur-lg">
        <h1 className="font-serif text-lg font-semibold text-forest dark:text-leaf">EcosysAI</h1>
        <div className="flex items-center gap-2">
          <AuthButton />
          <ThemeToggle />
        </div>
      </header>
      <div className="flex flex-1 flex-col">{children}</div>
      <BottomNav />
    </>
  )
}
