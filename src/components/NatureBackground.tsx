"use client"

import { useEffect, useState, useRef } from "react"
import { NATURE_BACKGROUNDS } from "@/lib/constants"

export default function NatureBackground() {
  const [visible, setVisible] = useState(false)
  const [index, setIndex] = useState(0)
  const [loaded, setLoaded] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Check localStorage every 500ms for the natureBg setting
  // This catches changes made in the settings page within the same tab
  useEffect(() => {
    function check() {
      try {
        const saved = localStorage.getItem("ecosys-settings")
        if (saved) {
          const parsed = JSON.parse(saved)
          setVisible(!!parsed.natureBg)
        } else {
          setVisible(false)
        }
      } catch {
        setVisible(false)
      }
    }
    check()
    const id = setInterval(check, 500)
    return () => clearInterval(id)
  }, [])

  // Start/stop the image rotation
  useEffect(() => {
    if (!visible) {
      if (intervalRef.current) clearInterval(intervalRef.current)
      return
    }

    const idx = Math.floor(Math.random() * NATURE_BACKGROUNDS.length)
    setIndex(idx)
    setLoaded(false)

    // Preload next image
    const preloadNext = (currentIdx: number) => {
      const img = new Image()
      img.src = NATURE_BACKGROUNDS[(currentIdx + 1) % NATURE_BACKGROUNDS.length]
    }
    preloadNext(idx)

    intervalRef.current = setInterval(() => {
      setIndex((prev) => {
        const next = (prev + 1) % NATURE_BACKGROUNDS.length
        setLoaded(false)
        preloadNext(next)
        return next
      })
    }, 40000)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [visible])

  if (!visible) return null

  return (
    <>
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: -1,
          transition: "opacity 1.5s ease-in-out",
          opacity: loaded ? 1 : 0,
          backgroundImage: `url(${NATURE_BACKGROUNDS[index]})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          willChange: "opacity",
        }}
      />
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: -1,
          background: "rgba(0,0,0,0.45)",
          pointerEvents: "none",
        }}
      />
      <img
        src={NATURE_BACKGROUNDS[index]}
        alt=""
        onLoad={() => setLoaded(true)}
        style={{ display: "none" }}
      />
    </>
  )
}
