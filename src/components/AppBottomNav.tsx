"use client"

import { useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { signOut } from "next-auth/react"

const primaryNav = [
  { id: "dashboard", label: "Home", href: "/dashboard", icon: "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect x=\"3\" y=\"3\" width=\"7\" height=\"7\"/><rect x=\"14\" y=\"3\" width=\"7\" height=\"7\"/><rect x=\"14\" y=\"14\" width=\"7\" height=\"7\"/><rect x=\"3\" y=\"14\" width=\"7\" height=\"7\"/></svg>" },
  { id: "scan", label: "Scan", href: "/scan", icon: "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z\"/><circle cx=\"12\" cy=\"12\" r=\"3\"/></svg>" },
  { id: "rewards", label: "Rewards", href: "/rewards", icon: "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"12\" cy=\"12\" r=\"10\"/><path d=\"M8 12l2 2 4-4\"/></svg>" },
  { id: "leaderboard", label: "Board", href: "/leaderboard", icon: "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M6 9H4.5a2.5 2.5 0 0 1 0-5C7 4 6 9 6 9z\"/><path d=\"M18 9h1.5a2.5 2.5 0 0 0 0-5C17 4 18 9 18 9z\"/><path d=\"M4 22h16\"/><path d=\"M10 22V5c0-1.1.9-2 2-2s2 .9 2 2v17\"/><path d=\"M6 22V9\"/><path d=\"M18 22V9\"/></svg>" },
]

const secondaryNav = [
  { id: "analytics", label: "Analytics", href: "/analytics", icon: "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><line x1=\"18\" y1=\"20\" x2=\"18\" y2=\"10\"/><line x1=\"12\" y1=\"20\" x2=\"12\" y2=\"4\"/><line x1=\"6\" y1=\"20\" x2=\"6\" y2=\"14\"/></svg>" },
  { id: "profile", label: "Profile", href: "/profile", icon: "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2\"/><circle cx=\"12\" cy=\"7\" r=\"4\"/></svg>" },
  { id: "settings", label: "Settings", href: "/settings", icon: "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"12\" cy=\"12\" r=\"3\"/><path d=\"M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z\"/></svg>" },
]

export default function AppBottomNav() {
  const pathname = usePathname()
  const router = useRouter()
  const [showMore, setShowMore] = useState(false)

  const currentPath = pathname.split("/").filter(Boolean)[0] || "dashboard"

  return (
    <>
      <nav className="mobile-bottom-nav" id="bottomNav">
        {primaryNav.map((item) => (
          <button
            key={item.id}
            className={`mob-nav-item${currentPath === item.id ? " active" : ""}`}
            onClick={() => router.push(item.href)}
            dangerouslySetInnerHTML={{ __html: item.icon + "<span>" + item.label + "</span>" }}
          />
        ))}
        <button
          className={`mob-nav-item${showMore ? " active" : ""}`}
          onClick={() => setShowMore(!showMore)}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="5" r="1.5" fill="currentColor" /><circle cx="12" cy="12" r="1.5" fill="currentColor" /><circle cx="12" cy="19" r="1.5" fill="currentColor" />
          </svg>
          <span>More</span>
        </button>
      </nav>

      {showMore && (
        <>
          <div className="overlay show" style={{ zIndex: 199, cursor: "pointer" }} onClick={() => setShowMore(false)} />
          <div style={{
            position: "fixed", bottom: 72, left: "50%", transform: "translateX(-50%)",
            zIndex: 200, width: "calc(100% - 48px)", maxWidth: 400,
            background: "var(--glass)", backdropFilter: "blur(24px) saturate(1.4)",
            WebkitBackdropFilter: "blur(24px) saturate(1.4)",
            border: "1px solid var(--glass-border)", borderRadius: 16,
            boxShadow: "0 8px 40px rgba(0,0,0,0.15)", overflow: "hidden",
            padding: 8,
          }}>
            {secondaryNav.map((item) => (
              <button
                key={item.id}
                onClick={() => { setShowMore(false); router.push(item.href) }}
                style={{
                  display: "flex", alignItems: "center", gap: 12, padding: "12px 16px",
                  width: "100%", border: "none", background: currentPath === item.id ? "var(--grey-100)" : "transparent",
                  borderRadius: 10, cursor: "pointer", fontSize: 14, fontWeight: 500,
                  fontFamily: "inherit", color: "var(--grey-700)", textAlign: "left",
                }}
                dangerouslySetInnerHTML={{ __html: item.icon.replace('stroke-width="2"', 'width="20" height="20" stroke-width="1.8"') + "<span>" + item.label + "</span>" }}
              />
            ))}
            <div style={{ height: 1, background: "var(--grey-200)", margin: "4px 0" }} />
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              style={{
                display: "flex", alignItems: "center", gap: 12, padding: "12px 16px",
                width: "100%", border: "none", background: "transparent",
                borderRadius: 10, cursor: "pointer", fontSize: 14, fontWeight: 500,
                fontFamily: "inherit", color: "var(--danger)", textAlign: "left",
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
              <span>Logout</span>
            </button>
          </div>
        </>
      )}
    </>
  )
}
