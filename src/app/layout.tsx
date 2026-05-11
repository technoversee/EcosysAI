import type { Metadata } from "next"
import "./globals.css"
import BottomNav from "@/components/BottomNav"
import ThemeToggle from "@/components/ThemeToggle"
import SplashScreen from "@/components/SplashScreen"
import NotificationBanner from "@/components/NotificationBanner"

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
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400,500,600,700&family=Inter:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-dvh flex flex-col antialiased">
        <SplashScreen />
        <header className="sticky top-0 z-40 flex items-center justify-between bg-bg/80 px-6 py-3 backdrop-blur-xl">
          <div className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-[10px]">🌱</span>
            <span className="font-serif text-base font-semibold tracking-tight text-primary">EcosysAI</span>
          </div>
          <ThemeToggle />
        </header>
        <NotificationBanner />
        <div className="flex flex-1 flex-col">{children}</div>
        <BottomNav />
      </body>
    </html>
  )
}
