"use client"

import { useEffect, useState } from "react"
import { Sparkles } from "lucide-react"
import { WASTE_FACTS } from "@/lib/constants"

export default function NotificationBanner() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % WASTE_FACTS.length)
    }, 8000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="flex items-center gap-2.5 bg-gradient-to-r from-pine/6 via-pine/3 to-pine/6 px-5 py-2.5 text-sm text-pine">
      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-pine/8">
        <Sparkles size={11} />
      </span>
      <p className="animate-fadeIn truncate font-medium leading-snug">{WASTE_FACTS[index]}</p>
    </div>
  )
}
