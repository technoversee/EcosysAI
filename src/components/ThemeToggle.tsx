"use client"

import { useEffect, useState } from "react"
import { Moon, Sun } from "lucide-react"

export default function ThemeToggle() {
  const [dark, setDark] = useState(false)
  useEffect(() => { setDark(document.documentElement.classList.contains("dark")) }, [])

  return (
    <button
      onClick={() => { const n = !dark; setDark(n); document.documentElement.classList.toggle("dark", n) }}
      className="flex h-8 w-8 items-center justify-center rounded-lg text-warm-grey transition-all duration-200 hover:bg-pine/8 hover:text-pine active:scale-90 md:h-9 md:w-9"
      aria-label="Toggle theme"
    >
      {dark ? <Sun size={15} /> : <Moon size={15} />}
    </button>
  )
}
