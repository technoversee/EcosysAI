"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import AppSidebar from "@/components/AppSidebar"
import AppTopbar from "@/components/AppTopbar"
import AppBottomNav from "@/components/AppBottomNav"
import ScanFab from "@/components/ScanFab"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("ecosort-token")
    const userData = localStorage.getItem("ecosort-user")
    if (!token || !userData) {
      router.push("/")
      return
    }
    const savedTheme = localStorage.getItem("ecosort-theme")
    if (savedTheme) {
      document.documentElement.setAttribute("data-theme", savedTheme)
    }
  }, [router])

  return (
    <div className="app-shell" id="app">
      <AppSidebar />
      <div className="main-area">
        <AppTopbar />
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
