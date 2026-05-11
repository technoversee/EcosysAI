"use client"

import { useEffect, useState } from "react"
import { Leaf } from "lucide-react"
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
    <div className="flex items-center gap-2 bg-leaf/10 px-4 py-2 text-sm text-forest dark:text-leaf">
      <Leaf size={16} className="shrink-0" />
      <p className="animate-fadeIn truncate">{WASTE_FACTS[index]}</p>
    </div>
  )
}
