"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useSession, signOut } from "next-auth/react"

function useTheme() {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"))
  }, [])

  const toggle = useCallback(() => {
    const next = !document.documentElement.classList.contains("dark")
    document.documentElement.classList.toggle("dark", next)
    localStorage.setItem("ecosys-theme", next ? "dark" : "light")
    setDark(next)
  }, [])

  return { dark, toggle }
}

export default function AppTopbar({ onNotifClick }: { onNotifClick?: () => void }) {
  const router = useRouter()
  const { data: session } = useSession()
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const { dark, toggle: toggleTheme } = useTheme()

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener("click", handleClick)
    return () => document.removeEventListener("click", handleClick)
  }, [])

  const userName = session?.user?.name || session?.user?.email || "U"
  const avatarLetter = userName.charAt(0).toUpperCase()

  return (
    <header className="topbar">
      <div className="topbar-left">
        <svg viewBox="0 0 32 32" fill="none" style={{ width: 28, height: 28 }}>
          <circle cx="16" cy="16" r="14" fill="url(#logo-grad-t)" opacity="0.15" />
          <path d="M16 6c-5.523 0-10 4.477-10 10s4.477 10 10 10c2.3 0 4.42-.777 6.121-2.09l-3.182-3.182A5.97 5.97 0 0 1 16 22c-3.314 0-6-2.686-6-6s2.686-6 6-6 6 2.686 6 6v.5l4 4V16c0-5.523-4.477-10-10-10z" fill="var(--emerald)" />
          <path d="M22.5 20.5l4 4-4 4" stroke="var(--mint)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="16" cy="16" r="3" fill="var(--emerald-light)" />
          <defs><linearGradient id="logo-grad-t" x1="0" y1="0" x2="32" y2="32"><stop offset="0%" stopColor="var(--emerald)" /><stop offset="100%" stopColor="var(--mint)" /></linearGradient></defs>
        </svg>
        <span style={{ fontWeight: 700, fontSize: 16, color: "var(--grey-800)", marginLeft: 8 }}>EcosysAI</span>
      </div>
      <div className="topbar-actions">
        <button className="topbar-btn" onClick={onNotifClick}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          <span className="notif-dot" />
        </button>
        <button className="topbar-btn" onClick={toggleTheme} aria-label="Toggle theme">
          <svg className="sun-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: dark ? "none" : "block", width: 20, height: 20 }}>
            <circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </svg>
          <svg className="moon-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: dark ? "block" : "none", width: 20, height: 20 }}>
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        </button>
        <div className="user-avatar-wrap" ref={dropdownRef}>
          <div className="user-avatar" onClick={() => setShowDropdown(!showDropdown)}>{avatarLetter}</div>
          <div className={`profile-dropdown${showDropdown ? " show" : ""}`}>
            <button className="dd-item" onClick={() => { setShowDropdown(false); router.push("/profile") }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
              Profile
            </button>
            <button className="dd-item" onClick={() => { setShowDropdown(false); router.push("/settings") }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>
              Settings
            </button>
            <div className="dd-divider" />
            <button className="dd-item danger" onClick={() => signOut({ callbackUrl: "/" })}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
