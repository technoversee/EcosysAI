import type { Metadata } from "next"
import { Fraunces, Inter } from "next/font/google"
import "./globals.css"
import BottomNav from "@/components/BottomNav"
import NotificationBanner from "@/components/NotificationBanner"
import ThemeToggle from "@/components/ThemeToggle"
import NatureBackground from "@/components/NatureBackground"

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  axes: ["SOFT", "WONK", "opsz"],
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

export const metadata: Metadata = {
  title: "EcosysAI — Scan. Sort. Earn.",
  description: "AI-powered waste segregation assistant for a cleaner planet.",
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable} antialiased`} suppressHydrationWarning>
      <body className="min-h-dvh flex flex-col">
        <NatureBackground />
        <header className="sticky top-0 z-50 flex items-center justify-between border-b border-card-border bg-card/70 px-5 py-3 backdrop-blur-xl">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-pine text-sm">🌱</span>
            <h1 className="font-serif text-lg font-semibold tracking-tight text-pine">
              EcosysAI
            </h1>
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
