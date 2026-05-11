"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import AppSidebar from "@/components/AppSidebar"
import AppTopbar from "@/components/AppTopbar"
import AppBottomNav from "@/components/AppBottomNav"
import AppNotifications from "@/components/AppNotifications"
import NatureBackground from "@/components/NatureBackground"
import ScanFab from "@/components/ScanFab"
import NotificationBanner from "@/components/NotificationBanner"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [notifOpen, setNotifOpen] = useState(false)
  const [natureBg, setNatureBg] = useState(false)

  useEffect(() => {
    try {
      const saved = localStorage.getItem("ecosort-settings")
      if (saved) {
        const parsed = JSON.parse(saved)
        setNatureBg(!!parsed.natureBg)
      }
    } catch {}
  }, [])

  // Listen for changes from settings page
  useEffect(() => {
    function handleStorage() {
      try {
        const saved = localStorage.getItem("ecosort-settings")
        if (saved) setNatureBg(!!JSON.parse(saved).natureBg)
      } catch {}
    }
    window.addEventListener("storage", handleStorage)
    return () => window.removeEventListener("storage", handleStorage)
  }, [])

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  if (status === "loading") {
    return (
      <div className="app-shell" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100dvh", color: "var(--grey-400)", fontSize: 14 }}>
        Loading...
      </div>
    )
  }

  if (!session) return null

  return (
    <div className="app-shell" id="app">
      {natureBg && <NatureBackground />}
      <AppSidebar />
      <div className="main-area">
        <AppTopbar onNotifClick={() => setNotifOpen((v) => !v)} />
        <NotificationBanner />
        <AppNotifications open={notifOpen} onClose={() => setNotifOpen(false)} />
        <div className="screens" id="screensContainer">
          {children}
        </div>
      </div>
      <AppBottomNav />
      <ScanFab />
      <div className="confetti-container" id="confettiContainer" />
    </div>
  )
}
