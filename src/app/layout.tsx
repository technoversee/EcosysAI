import type { Metadata } from "next"
import { Fraunces, Inter } from "next/font/google"
import "./globals.css"
import BottomNav from "@/components/BottomNav"
import NotificationBanner from "@/components/NotificationBanner"
import ThemeToggle from "@/components/ThemeToggle"

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
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
      <body className="min-h-dvh flex flex-col bg-background font-sans text-foreground">
        <header className="sticky top-0 z-50 flex items-center justify-between border-b border-card-border bg-card/80 px-4 py-2.5 backdrop-blur-lg">
          <h1 className="font-serif text-lg font-semibold text-forest dark:text-leaf">EcosysAI</h1>
          <ThemeToggle />
        </header>
        <NotificationBanner />
        <div className="flex flex-1 flex-col">{children}</div>
        <BottomNav />
      </body>
    </html>
  )
}
