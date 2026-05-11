"use client"

import { usePathname, useRouter } from "next/navigation"
import { signOut } from "next-auth/react"

const navItems = [
  { id: "dashboard", label: "Dashboard", href: "/dashboard", icon: "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect x=\"3\" y=\"3\" width=\"7\" height=\"7\"/><rect x=\"14\" y=\"3\" width=\"7\" height=\"7\"/><rect x=\"14\" y=\"14\" width=\"7\" height=\"7\"/><rect x=\"3\" y=\"14\" width=\"7\" height=\"7\"/></svg>" },
  { id: "scan", label: "Scan Waste", href: "/scan", icon: "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z\"/><circle cx=\"12\" cy=\"12\" r=\"3\"/></svg>" },
  { id: "rewards", label: "Rewards", href: "/rewards", icon: "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"12\" cy=\"12\" r=\"10\"/><path d=\"M8 12l2 2 4-4\"/></svg>" },
  { id: "leaderboard", label: "Leaderboard", href: "/leaderboard", icon: "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M6 9H4.5a2.5 2.5 0 0 1 0-5C7 4 6 9 6 9z\"/><path d=\"M18 9h1.5a2.5 2.5 0 0 0 0-5C17 4 18 9 18 9z\"/><path d=\"M4 22h16\"/><path d=\"M10 22V5c0-1.1.9-2 2-2s2 .9 2 2v17\"/><path d=\"M6 22V9\"/><path d=\"M18 22V9\"/></svg>" },
  { id: "analytics", label: "Analytics", href: "/analytics", icon: "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><line x1=\"18\" y1=\"20\" x2=\"18\" y2=\"10\"/><line x1=\"12\" y1=\"20\" x2=\"12\" y2=\"4\"/><line x1=\"6\" y1=\"20\" x2=\"6\" y2=\"14\"/></svg>" },
  { id: "profile", label: "Profile", href: "/profile", icon: "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2\"/><circle cx=\"12\" cy=\"7\" r=\"4\"/></svg>" },
  { id: "settings", label: "Settings", href: "/settings", icon: "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"12\" cy=\"12\" r=\"3\"/><path d=\"M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z\"/></svg>" },
]

export default function AppSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const currentPath = pathname.split("/").filter(Boolean)[0] || "dashboard"

  return (
    <aside className="sidebar" id="sidebar">
      <div className="sidebar-brand" onClick={() => router.push("/dashboard")} style={{ cursor: "pointer" }}>
        <svg viewBox="0 0 32 32" fill="none">
          <circle cx="16" cy="16" r="14" fill="url(#logo-grad-s)" opacity="0.15" />
          <path d="M16 6c-5.523 0-10 4.477-10 10s4.477 10 10 10c2.3 0 4.42-.777 6.121-2.09l-3.182-3.182A5.97 5.97 0 0 1 16 22c-3.314 0-6-2.686-6-6s2.686-6 6-6 6 2.686 6 6v.5l4 4V16c0-5.523-4.477-10-10-10z" fill="var(--emerald)" />
          <path d="M22.5 20.5l4 4-4 4" stroke="var(--mint)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="16" cy="16" r="3" fill="var(--emerald-light)" />
          <defs><linearGradient id="logo-grad-s" x1="0" y1="0" x2="32" y2="32"><stop offset="0%" stopColor="var(--emerald)" /><stop offset="100%" stopColor="var(--mint)" /></linearGradient></defs>
        </svg>
        EcoSort AI
      </div>
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`nav-item${currentPath === item.id ? " active" : ""}`}
            onClick={() => router.push(item.href)}
            dangerouslySetInnerHTML={{ __html: item.icon + "<span>" + item.label + "</span>" }}
          />
        ))}
        <button className="nav-item logout" onClick={() => signOut({ callbackUrl: "/" })}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
          <span>Logout</span>
        </button>
      </nav>
    </aside>
  )
}
