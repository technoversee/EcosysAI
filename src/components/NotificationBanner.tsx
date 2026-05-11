"use client"

import { useEffect, useState } from "react"
import { WASTE_FACTS } from "@/lib/constants"

export default function NotificationBanner() {
  const [i, setI] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setI((p) => (p + 1) % WASTE_FACTS.length), 8000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="flex items-center gap-2.5 bg-primary/5 px-6 py-2.5 text-sm text-primary">
      <span className="h-1.5 w-1.5 rounded-full bg-accent" />
      <p className="animate-fadeIn truncate font-medium">{WASTE_FACTS[i]}</p>
    </div>
  )
}
