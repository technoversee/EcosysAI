"use client"

import { useEffect, useState } from "react"
import { Moon, Sun } from "lucide-react"

export default function ThemeToggle() {
  const [dark, setDark] = useState(false)
  useEffect(() => { setDark(document.documentElement.classList.contains("dark")) }, [])

  return (
    <button
      onClick={() => { const n = !dark; setDark(n); document.documentElement.classList.toggle("dark", n) }}
      className="flex h-8 w-8 items-center justify-center rounded-lg text-muted transition-colors hover:bg-primary/8 hover:text-primary active:scale-90"
    >
      {dark ? <Sun size={15} /> : <Moon size={15} />}
    </button>
  )
}
