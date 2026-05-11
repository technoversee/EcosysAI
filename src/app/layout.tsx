import type { Metadata } from "next"
import "./globals.css"
import Sidebar from "@/components/Sidebar"
import BottomNav from "@/components/BottomNav"
import ThemeToggle from "@/components/ThemeToggle"
import NotificationBanner from "@/components/NotificationBanner"
import NatureBackground from "@/components/NatureBackground"
import SplashScreen from "@/components/SplashScreen"
import AuthButton from "@/components/AuthButton"
import Providers from "@/components/Providers"

export const metadata: Metadata = {
  title: "EcosysAI — Scan. Sort. Earn.",
  description: "AI-powered waste segregation assistant for a cleaner planet.",
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400,500,600,700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-dvh flex flex-col font-sans antialiased">
        <Providers>
        <SplashScreen />
        <NatureBackground />

        {/* Desktop sidebar */}
        <Sidebar />

        {/* Desktop top bar (hidden on mobile/tablet) */}
        <header className="hidden lg:flex sticky top-0 z-30 glass-header px-8 py-3 items-center justify-between" style={{ marginLeft: "15rem" }}>
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
            <span className="text-sm text-warm-grey">System Online</span>
          </div>
          <ThemeToggle />
        </header>

        {/* Mobile/tablet header */}
        <header className="flex lg:hidden sticky top-0 z-30 glass-header px-5 py-3 items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-pine to-pine-light text-[10px] shadow-sm md:h-8 md:w-8 md:rounded-xl md:text-xs">🌱</span>
            <span className="font-serif text-sm font-semibold tracking-tight text-pine md:text-base">EcosysAI</span>
          </div>
          <ThemeToggle />
        </header>

        <NotificationBanner />
        <div className="flex flex-1 flex-col lg:ml-60">{children}</div>
        <BottomNav />
        </Providers>
      </body>
    </html>
  )
}
