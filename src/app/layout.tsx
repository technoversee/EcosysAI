import type { Metadata } from "next"
import { Fraunces, Inter } from "next/font/google"
import "./globals.css"
import Providers from "@/components/Providers"

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
      <body className="min-h-dvh bg-background font-sans text-foreground">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
