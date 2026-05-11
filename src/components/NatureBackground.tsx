"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

const IMAGES = [
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&q=80",
  "https://images.unsplash.com/photo-1518173946687-a3c1e3c0eac6?w=1920&q=80",
  "https://images.unsplash.com/photo-1470071459604-7b8ec44ffd4d?w=1920&q=80",
  "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=1920&q=80",
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80",
]

export default function NatureBackground() {
  const [index, setIndex] = useState(0)
  const [loaded, setLoaded] = useState(false)
  const [nextReady, setNextReady] = useState(true)

  useEffect(() => {
    const img = new Image()
    img.src = IMAGES[0]
    img.onload = () => setLoaded(true)
  }, [])

  useEffect(() => {
    if (!loaded) return
    const id = setInterval(() => {
      setNextReady(false)
      const next = (index + 1) % IMAGES.length
      const img = new Image()
      img.src = IMAGES[next]
      img.onload = () => {
        setIndex(next)
        setNextReady(true)
      }
    }, 12000)
    return () => clearInterval(id)
  }, [loaded, index])

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {IMAGES.map((src, i) => (
        <div
          key={src}
          className={cn(
            "absolute inset-0 bg-cover bg-center transition-opacity duration-[2000ms] ease-in-out",
            i === index ? "opacity-40 dark:opacity-20" : "opacity-0"
          )}
          style={{ backgroundImage: `url(${src})` }}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/30 to-background" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(27,67,50,0.03)_0%,transparent_70%)]" />
    </div>
  )
}
