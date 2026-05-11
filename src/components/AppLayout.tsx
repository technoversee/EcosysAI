"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import AppSidebar from "@/components/AppSidebar"
import AppTopbar from "@/components/AppTopbar"
import AppBottomNav from "@/components/AppBottomNav"
import ScanFab from "@/components/ScanFab"
import NotificationBanner from "@/components/NotificationBanner"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const router = useRouter()

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
      <AppSidebar />
      <div className="main-area">
        <AppTopbar />
        <NotificationBanner />
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
