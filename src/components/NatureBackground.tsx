"use client"

import { useEffect, useState } from "react"
import { NATURE_BACKGROUNDS } from "@/lib/constants"

export default function NatureBackground() {
  const [index, setIndex] = useState(0)
  const [loaded, setLoaded] = useState(false)
  const [nextReady, setNextReady] = useState(false)

  useEffect(() => {
    const idx = Math.floor(Math.random() * NATURE_BACKGROUNDS.length)
    setIndex(idx)

    const preload = new Image()
    preload.src = NATURE_BACKGROUNDS[(idx + 1) % NATURE_BACKGROUNDS.length]
    preload.onload = () => setNextReady(true)

    const interval = setInterval(() => {
      setIndex((prev) => {
        const next = (prev + 1) % NATURE_BACKGROUNDS.length
        const pre = new Image()
        pre.src = NATURE_BACKGROUNDS[(next + 1) % NATURE_BACKGROUNDS.length]
        return next
      })
    }, 40000)

    return () => clearInterval(interval)
  }, [])

  return (
    <>
      {/* Preload current image */}
      <link rel="preload" href={NATURE_BACKGROUNDS[index]} as="image" />
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
      {/* Dark overlay so text remains readable */}
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
