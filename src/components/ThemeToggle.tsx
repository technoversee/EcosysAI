"use client"

import { useEffect, useState } from "react"
import { Moon, Sun } from "lucide-react"
import { cn } from "@/lib/utils"

export default function ThemeToggle() {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark")
    setDark(isDark)
  }, [])

  function toggle() {
    const next = !dark
    setDark(next)
    document.documentElement.classList.toggle("dark", next)
  }

  return (
    <button
      onClick={toggle}
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-200",
        "text-muted hover:bg-forest/10 hover:text-forest dark:hover:bg-leaf/10 dark:hover:text-leaf"
      )}
      aria-label="Toggle dark mode"
    >
      <div className="transition-transform duration-300 active:scale-90">
        {dark ? <Sun size={17} /> : <Moon size={17} />}
      </div>
    </button>
  )
}
