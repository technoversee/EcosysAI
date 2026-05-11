"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

// ── Particle System ──
function useParticles(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let particles: {
      x: number; y: number; size: number
      speedX: number; speedY: number
      opacity: number; hue: number
    }[] = []
    let animId: number

    function resize() {
      const parent = canvas!.parentElement!
      canvas!.width = parent.offsetWidth
      canvas!.height = parent.offsetHeight
    }
    resize()
    window.addEventListener("resize", resize)

    function createParticle() {
      const isDark = document.documentElement.classList.contains("dark")
      return {
        x: Math.random() * canvas!.width,
        y: Math.random() * canvas!.height,
        size: Math.random() * 2.5 + 0.5,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.4 + 0.1,
        hue: isDark ? 150 + Math.random() * 30 : 120 + Math.random() * 60,
      }
    }

    const count = Math.min(60, Math.floor(canvas.width * canvas.height / 12000))
    particles = Array.from({ length: count }, createParticle)

    function animate() {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height)
      for (const p of particles) {
        p.x += p.speedX
        p.y += p.speedY
        if (p.x < 0 || p.x > canvas!.width || p.y < 0 || p.y > canvas!.height) {
          Object.assign(p, createParticle())
        }
        ctx!.beginPath()
        ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx!.fillStyle = `hsla(${p.hue}, 50%, 55%, ${p.opacity})`
        ctx!.fill()
      }
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 120) {
            ctx!.beginPath()
            ctx!.moveTo(particles[i].x, particles[i].y)
            ctx!.lineTo(particles[j].x, particles[j].y)
            ctx!.strokeStyle = `hsla(140, 30%, 60%, ${0.08 * (1 - dist / 120)})`
            ctx!.lineWidth = 0.6
            ctx!.stroke()
          }
        }
      }
      animId = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener("resize", resize)
    }
  }, [canvasRef])
}

// ── Theme ──
function useTheme() {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark")
    setDark(isDark)
  }, [])

  const toggle = useCallback(() => {
    const next = !document.documentElement.classList.contains("dark")
    document.documentElement.classList.toggle("dark", next)
    setDark(next)
  }, [])

  return { dark, toggle }
}

// ── Counter Hook ──
function useCounterAnimation() {
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement
            const target = parseInt(el.dataset.target || "0", 10)
            const duration = 2000
            const start = performance.now()
            function update(now: number) {
              const elapsed = now - start
              const progress = Math.min(elapsed / duration, 1)
              const eased = 1 - Math.pow(1 - progress, 3)
              el.textContent = Math.floor(eased * target).toLocaleString()
              if (progress < 1) requestAnimationFrame(update)
            }
            requestAnimationFrame(update)
            observerRef.current?.unobserve(el)
          }
        }
      },
      { threshold: 0.5 }
    )

    document.querySelectorAll(".counter").forEach((el) => observerRef.current?.observe(el))

    return () => observerRef.current?.disconnect()
  }, [])
}

// ── Scroll Reveal ──
function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible")
          }
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    )

    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])
}

// ── SVG Components ──
function LogoSvg({ size = 30 }: { size?: number }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" style={{ width: size, height: size }}>
      <defs>
        <linearGradient id="logo-grad" x1="0" y1="0" x2="32" y2="32">
          <stop offset="0%" stopColor="var(--emerald)" />
          <stop offset="100%" stopColor="var(--mint)" />
        </linearGradient>
      </defs>
      <circle cx="16" cy="16" r="14" fill="url(#logo-grad)" opacity="0.15" />
      <path d="M16 6c-5.523 0-10 4.477-10 10s4.477 10 10 10c2.3 0 4.42-.777 6.121-2.09l-3.182-3.182A5.97 5.97 0 0 1 16 22c-3.314 0-6-2.686-6-6s2.686-6 6-6 6 2.686 6 6v.5l4 4V16c0-5.523-4.477-10-10-10z" fill="var(--emerald)" />
      <path d="M22.5 20.5l4 4-4 4" stroke="var(--mint)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="16" cy="16" r="3" fill="var(--emerald-light)" />
    </svg>
  )
}

function HeroSvgCenter() {
  return (
    <svg viewBox="0 0 120 120" fill="none" style={{ width: "100%", height: "100%" }}>
      <defs>
        <radialGradient id="eco-grad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--emerald)" />
          <stop offset="100%" stopColor="var(--mint)" />
        </radialGradient>
      </defs>
      <circle cx="60" cy="60" r="50" fill="url(#eco-grad)" opacity="0.15" />
      <path d="M60 15C35.147 15 15 35.147 15 60c0 24.853 20.147 45 45 45 10.364 0 19.904-3.506 27.473-9.395l-14.318-14.318A26.85 26.85 0 0 1 60 86.25c-14.827 0-26.25-11.423-26.25-26.25S45.173 33.75 60 33.75 86.25 45.173 86.25 60v2.25l17.958 17.958C106.62 74.97 107.5 68.52 107.5 60c0-24.853-20.147-45-45-45h-2.5z" fill="var(--emerald)" opacity="0.8" />
      <circle cx="60" cy="60" r="18" fill="var(--emerald-light)" opacity="0.6" />
      <path d="M96 82l12 12-12 12" stroke="var(--mint)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" />
      <path d="M28 75l-8 8 8 8" stroke="var(--sage)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
      <circle cx="38" cy="38" r="5" fill="var(--mint)" opacity="0.5" />
      <circle cx="82" cy="40" r="4" fill="var(--aqua)" opacity="0.5" />
      <circle cx="44" cy="82" r="3.5" fill="var(--mint-light)" opacity="0.5" />
      <path d="M60 15v8M60 97v8M15 60h8M97 60h8" stroke="var(--emerald)" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.3" />
    </svg>
  )
}

// ── Floating Elements Data ──
const floatItems = [
  { top: "5%", left: "5%", delay: "0s", content: <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><path d="M16 2L4 10v12l12 8 12-8V10L16 2z" fill="var(--mint)" opacity="0.4" /><path d="M16 6l-8 5.333v10.667l8 5.333 8-5.333V11.333L16 6z" fill="var(--mint-light)" opacity="0.3" /></svg> },
  { top: "3%", right: "6%", delay: "1.5s", content: <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><circle cx="14" cy="14" r="12" stroke="var(--emerald)" strokeWidth="1.5" opacity="0.3" strokeDasharray="4 4" /><circle cx="14" cy="14" r="6" fill="var(--aqua)" opacity="0.25" /></svg> },
  { bottom: "8%", left: "2%", delay: "3s", content: <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 2L2 7l10 5 10-5-10-5z" fill="var(--sage)" opacity="0.3" /><path d="M2 17l10 5 10-5" stroke="var(--sage)" strokeWidth="1.5" opacity="0.3" /><path d="M2 12l10 5 10-5" stroke="var(--sage)" strokeWidth="1.5" opacity="0.2" /></svg> },
  { bottom: "5%", right: "4%", delay: "0.8s", content: <svg width="30" height="30" viewBox="0 0 30 30" fill="none"><rect x="3" y="3" width="24" height="24" rx="4" stroke="var(--mint)" strokeWidth="1.5" opacity="0.3" /><path d="M15 10l-5 8h10l-5-8z" fill="var(--mint)" opacity="0.2" /></svg> },
  { top: "45%", left: "-2%", delay: "2.2s", content: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="8" fill="var(--aqua)" opacity="0.15" /><circle cx="10" cy="10" r="4" fill="var(--emerald)" opacity="0.2" /></svg> },
  { top: "35%", right: "-3%", delay: "1.2s", content: <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M11 1L1 11l10 10 10-10L11 1z" fill="var(--sage)" opacity="0.15" /></svg> },
]

// ── Features Data ──
const features = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--emerald)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a10 10 0 1 0 10 10" /><path d="M12 6v6l4 2" />
      </svg>
    ),
    title: "AI Waste Detection",
    desc: "Real-time camera-based waste identification with smart disposal guidance powered by advanced machine learning.",
    items: ["Camera-based waste identification", "Smart disposal guidance", "Multi-material recognition"],
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--emerald)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><path d="M8 12l2 2 4-4" />
      </svg>
    ),
    title: "Reward Ecosystem",
    desc: "Earn EcoPoints for every correct disposal, unlock sustainability badges, and redeem exclusive rewards.",
    items: ["EcoPoints rewards system", "QR coupon redemption", "Sustainability badges"],
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--emerald)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12a9 9 0 1 1-9-9" /><path d="M21 3v9h-9" />
      </svg>
    ),
    title: "Smart Analytics",
    desc: "Comprehensive tracking of your environmental impact with detailed insights and personalized recommendations.",
    items: ["Carbon footprint tracking", "Recycling statistics", "Sustainability insights"],
  },
]

// ── How it Works Data ──
const steps = [
  { num: 1, title: "Scan Waste", desc: "Point your camera at any waste item to begin" },
  { num: 2, title: "AI Detects", desc: "Our AI identifies the type of waste instantly" },
  { num: 3, title: "Dispose Correctly", desc: "Get disposal guidance for the correct bin" },
  { num: 4, title: "Earn EcoPoints", desc: "Collect points for every correct action" },
  { num: 5, title: "Redeem Rewards", desc: "Exchange points for real-world benefits" },
]

// ── Stats Data ──
const stats = [
  { target: 3850, suffix: "+", label: "Waste Recycled (kg)", icon: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--emerald)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  )},
  { target: 2480, suffix: "+", label: "CO2 Saved (kg)", icon: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--emerald)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><path d="M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20z" />
    </svg>
  )},
  { target: 12800, suffix: "+", label: "Active Users", icon: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--emerald)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )},
  { target: 5620, suffix: "+", label: "Rewards Redeemed", icon: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--emerald)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 12 20 22 4 22 4 12" /><rect x="2" y="7" width="20" height="5" rx="1" />
      <line x1="12" y1="22" x2="12" y2="7" /><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
      <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
    </svg>
  )},
]

// ── ── ── ── ── ── ── ── ── ── ──
// PAGE COMPONENT
// ── ── ── ── ── ── ── ── ── ── ──

export default function LandingPage() {
  const router = useRouter()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { dark, toggle: toggleTheme } = useTheme()

  useParticles(canvasRef)
  useCounterAnimation()
  useScrollReveal()

  // Navbar scroll effect
  useEffect(() => {
    const navbar = document.getElementById("landing-navbar")
    if (!navbar) return
    function onScroll() {
      navbar!.classList.toggle("scrolled", window.scrollY > 20)
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Smooth scroll for anchor links
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = e.target as HTMLElement
      const anchor = target.closest('a[href^="#"]')
      if (!anchor) return
      const href = (anchor as HTMLAnchorElement).getAttribute("href")
      if (!href) return
      const el = document.querySelector(href)
      if (el) {
        e.preventDefault()
        el.scrollIntoView({ behavior: "smooth", block: "start" })
      }
    }
    document.addEventListener("click", handleClick)
    return () => document.removeEventListener("click", handleClick)
  }, [])

  // Prevent body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [mobileOpen])

  function closeMobile() {
    setMobileOpen(false)
  }

  return (
    <div style={{ background: "var(--bg)", color: "var(--grey-800)", fontFamily: "'Inter', sans-serif" }}>
      {/* ── NAVBAR ── */}
      <nav
        id="landing-navbar"
        className="nav-glass"
        style={{
          position: "fixed",
          top: 16,
          left: "50%",
          transform: "translateX(-50%)",
          width: "calc(100% - 48px)",
          maxWidth: 1200,
          zIndex: 1000,
          borderRadius: 18,
          boxShadow: "0 4px 24px rgba(0,0,0,0.03)",
          padding: "0 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 58,
          transition: "background 0.4s, border 0.4s, box-shadow 0.4s",
        }}
      >
        <Link href="/" className="nav-logo" style={{ display: "flex", alignItems: "center", gap: 10, fontWeight: 700, fontSize: 17, color: "var(--grey-800)", textDecoration: "none" }}>
          <LogoSvg size={28} />
          EcoSort AI
        </Link>
        <div className="nav-links" style={{ display: "flex", alignItems: "center", gap: 28 }}>
          {["Features", "How It Works", "Impact", "About"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
              style={{
                fontSize: 14,
                fontWeight: 500,
                color: "var(--grey-600)",
                textDecoration: "none",
                transition: "color 0.25s",
                position: "relative",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "var(--emerald)" }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "var(--grey-600)" }}
            >
              {item}
            </a>
          ))}
        </div>
        <div className="nav-actions" style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            style={{
              width: 40, height: 40, borderRadius: 12, border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              background: "transparent", color: "var(--grey-600)", flexShrink: 0,
            }}
            aria-label="Toggle theme"
          >
            <svg className="sun-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 20, height: 20 }}>
              <circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
            <svg className="moon-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 20, height: 20 }}>
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          </button>
          <button
            onClick={() => router.push("/login")}
            className="btn-login"
            style={{
              fontSize: 14, fontWeight: 500, color: "var(--grey-600)",
              padding: "8px 18px", borderRadius: 10, border: "none",
              background: "transparent", cursor: "pointer",
            }}
          >
            Log in
          </button>
          <button
            onClick={() => router.push("/login")}
            className="btn-signup"
            style={{
              fontSize: 14, fontWeight: 600, padding: "8px 20px",
              borderRadius: 10, border: "none", cursor: "pointer",
              background: "linear-gradient(135deg, var(--emerald), var(--emerald-light))",
              color: "#fff", boxShadow: "0 2px 12px rgba(45,106,79,0.2)",
            }}
          >
            Sign Up
          </button>
        </div>
        <button
          className={`hamburger ${mobileOpen ? "active" : ""}`}
          onClick={() => setMobileOpen((v) => !v)}
          style={{
            display: "none", flexDirection: "column", gap: 5, cursor: "pointer",
            padding: 4, zIndex: 1001, background: "none", border: "none",
          }}
          aria-label="Menu"
        >
          <span style={{ display: "block", width: 24, height: 2, background: "var(--hamburger-color)", borderRadius: 2, transition: "all 0.3s" }} />
          <span style={{ display: "block", width: 24, height: 2, background: "var(--hamburger-color)", borderRadius: 2, transition: "all 0.3s" }} />
          <span style={{ display: "block", width: 24, height: 2, background: "var(--hamburger-color)", borderRadius: 2, transition: "all 0.3s" }} />
        </button>
      </nav>

      {/* ── MOBILE MENU ── */}
      <div
        style={{
          position: "fixed", top: 0, left: 0, width: "100%", height: "100vh",
          background: "var(--mobile-bg)", backdropFilter: "blur(32px)",
          WebkitBackdropFilter: "blur(32px)", zIndex: 999,
          display: "flex", flexDirection: "column", alignItems: "center",
          justifyContent: "center", gap: 28,
          opacity: mobileOpen ? 1 : 0,
          pointerEvents: mobileOpen ? "auto" : "none",
          transition: "opacity 0.4s, background 0.4s",
        }}
      >
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          style={{
            width: 44, height: 44, borderRadius: 12, border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "transparent", color: "var(--grey-600)", marginBottom: 8,
          }}
          aria-label="Toggle theme"
        >
          <svg className="sun-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 24, height: 24 }}>
            <circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </svg>
          <svg className="moon-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 24, height: 24 }}>
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        </button>
        {["Features", "How It Works", "Impact", "About"].map((item) => (
          <a
            key={item}
            href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
            onClick={closeMobile}
            style={{ fontSize: 20, fontWeight: 500, color: "var(--grey-700)", textDecoration: "none" }}
          >
            {item}
          </a>
        ))}
        <button
          onClick={() => { closeMobile(); router.push("/login") }}
          style={{
            fontSize: 18, fontWeight: 500, color: "var(--grey-600)",
            padding: "12px 32px", borderRadius: 10, border: "none",
            background: "transparent", cursor: "pointer",
          }}
        >
          Log in
        </button>
        <button
          onClick={() => { closeMobile(); router.push("/login") }}
          className="btn-signup"
          style={{
            fontSize: 18, fontWeight: 600, padding: "12px 32px",
            borderRadius: 10, border: "none", cursor: "pointer",
            background: "linear-gradient(135deg, var(--emerald), var(--emerald-light))",
            color: "#fff", boxShadow: "0 2px 12px rgba(45,106,79,0.2)",
          }}
        >
          Sign Up
        </button>
      </div>

      {/* ── HERO ── */}
      <section
        id="hero"
        style={{
          position: "relative",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          padding: "140px 24px 80px",
          background: "var(--hero-bg)",
          overflow: "hidden",
          transition: "background 0.6s",
        }}
      >
        <div
          style={{
            position: "absolute", top: "-30%", right: "-10%",
            width: 700, height: 700, borderRadius: "50%",
            background: "var(--hero-glow-1)", pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute", bottom: "-20%", left: "-5%",
            width: 500, height: 500, borderRadius: "50%",
            background: "var(--hero-glow-2)", pointerEvents: "none",
          }}
        />
        <canvas
          ref={canvasRef}
          id="particles-canvas"
          style={{
            position: "absolute", top: 0, left: 0,
            width: "100%", height: "100%", pointerEvents: "none", zIndex: 0,
          }}
        />
        <div
          className="container"
          style={{
            position: "relative", zIndex: 1,
            display: "grid", gridTemplateColumns: "1fr 1fr",
            gap: 64, alignItems: "center",
            width: "100%", maxWidth: 1200, margin: "0 auto",
          }}
        >
          <div className="hero-content" style={{ maxWidth: 580 }}>
            <div
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                fontSize: 13, fontWeight: 500, color: "var(--emerald)",
                background: "var(--badge-bg)", padding: "8px 18px",
                borderRadius: 100, marginBottom: 24,
                letterSpacing: "0.02em",
              }}
            >
              <span style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: "var(--emerald)", animation: "pulse-dot 2s ease-in-out infinite" }} />
              Powered by EcoSort AI
            </div>
            <h1
              style={{
                fontSize: "clamp(44px, 6vw, 72px)", fontWeight: 900,
                lineHeight: 1.08, letterSpacing: "-0.03em",
                color: "var(--grey-900)", marginBottom: 20,
              }}
            >
              Transform Waste<br />
              <span
                style={{
                  background: "linear-gradient(135deg, var(--emerald), var(--sage), var(--mint))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Into Impact
              </span>
            </h1>
            <p
              style={{
                fontSize: "clamp(16px, 1.3vw, 19px)",
                color: "var(--grey-600)", lineHeight: 1.7,
                marginBottom: 36, maxWidth: 480,
              }}
            >
              AI-powered waste segregation and sustainability rewards designed for smarter and greener communities.
            </p>
            <div className="hero-buttons" style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              <button
                className="btn-primary"
                onClick={() => router.push("/login")}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  fontSize: 16, fontWeight: 600, padding: "16px 32px",
                  borderRadius: 14, border: "none", cursor: "pointer",
                  background: "linear-gradient(135deg, var(--emerald), var(--emerald-light))",
                  color: "#fff", boxShadow: "0 4px 24px rgba(45,106,79,0.25)",
                  position: "relative", overflow: "hidden",
                }}
              >
                <span style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: 8 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2a10 10 0 1 0 10 10" /><path d="M12 6v6l4 2" />
                  </svg>
                  Start Scanning
                </span>
              </button>
              <button
                className="btn-secondary"
                onClick={() => router.push("/login")}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  fontSize: 16, fontWeight: 600, padding: "16px 32px",
                  borderRadius: 14, border: "1px solid var(--btn-secondary-border)",
                  cursor: "pointer", background: "var(--btn-secondary-bg)",
                  backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
                  color: "var(--grey-700)",
                  boxShadow: "0 2px 8px var(--shadow-1)",
                  position: "relative", overflow: "hidden",
                }}
              >
                <span style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: 8 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
                    <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
                  </svg>
                  Explore Dashboard
                </span>
              </button>
            </div>
          </div>

          {/* ── HERO ILLUSTRATION ── */}
          <div className="hero-illustration" style={{ position: "relative", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <div style={{ position: "relative", width: "100%", maxWidth: 520, aspectRatio: "1" }}>
              <div
                style={{
                  position: "absolute", top: "50%", left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: "80%", height: "80%", borderRadius: "50%",
                  background: "var(--ring-glow)",
                  animation: "ring-pulse 4s ease-in-out infinite",
                }}
              />
              <div
                style={{
                  position: "absolute", top: "50%", left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: "55%", height: "55%", borderRadius: "50%",
                  border: "1px solid var(--ring-border-2)",
                  animation: "ring-spin 20s linear infinite",
                }}
              />
              <div
                style={{
                  position: "absolute", top: "50%", left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: "70%", height: "70%", borderRadius: "50%",
                  border: "1px dashed var(--ring-border-3)",
                  animation: "ring-spin-reverse 25s linear infinite",
                }}
              />
              <div
                style={{
                  position: "absolute", top: "50%", left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: "35%", height: "35%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                <HeroSvgCenter />
              </div>
              {floatItems.map((item, i) => (
                <div
                  key={i}
                  className="float-item"
                  style={{
                    position: "absolute",
                    top: item.top, left: item.left, bottom: item.bottom, right: item.right,
                    animation: `float 6s ease-in-out infinite`,
                    animationDelay: item.delay,
                    opacity: 0.6,
                  }}
                >
                  {item.content}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" style={{ padding: "120px 0", background: "var(--bg)", transition: "background 0.4s" }}>
        <div className="container" style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <div className="section-header reveal" style={{ textAlign: "center", maxWidth: 640, margin: "0 auto 64px" }}>
            <span style={{ display: "inline-block", fontSize: 13, fontWeight: 600, color: "var(--emerald)", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 16 }}>
              Features
            </span>
            <h2 style={{ fontSize: "clamp(32px, 3.5vw, 48px)", fontWeight: 800, color: "var(--grey-900)", lineHeight: 1.15, letterSpacing: "-0.02em", marginBottom: 16 }}>
              Intelligent sustainability,<br />powered by AI
            </h2>
            <p style={{ fontSize: 17, color: "var(--grey-500)", lineHeight: 1.7 }}>
              Everything you need to make waste management smarter, rewarding, and impactful.
            </p>
          </div>
          <div
            className="features-grid"
            style={{
              display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 28,
            }}
          >
            {features.map((f, i) => (
              <div
                key={f.title}
                className={`feature-card reveal ${i === 0 ? "" : `reveal-delay-${i + 1}`}`}
                style={{
                  padding: "40px 32px", borderRadius: "var(--radius-md)",
                  background: "var(--glass)", backdropFilter: "blur(20px) saturate(1.4)",
                  WebkitBackdropFilter: "blur(20px) saturate(1.4)",
                  border: "1px solid var(--glass-border)",
                  boxShadow: "var(--glass-shadow)",
                  position: "relative", overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute", top: 0, left: 0, right: 0,
                    height: 3, background: "linear-gradient(90deg, var(--emerald), var(--mint), transparent)",
                    opacity: 0, transition: "opacity 0.5s",
                  }}
                  className="feature-card-accent"
                />
                <div
                  className="feature-icon"
                  style={{
                    width: 56, height: 56, borderRadius: 16,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    marginBottom: 24, background: "var(--feature-icon-bg)",
                    border: "1px solid var(--feature-icon-border)",
                  }}
                >
                  {f.icon}
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: "var(--grey-800)", marginBottom: 12 }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: "var(--grey-500)", lineHeight: 1.7 }}>{f.desc}</p>
                <ul
                  className="feature-list"
                  style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 8 }}
                >
                  {f.items.map((item) => (
                    <li
                      key={item}
                      style={{
                        fontSize: 14, color: "var(--grey-600)",
                        display: "flex", alignItems: "center", gap: 8,
                      }}
                    >
                      <span style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--emerald)", flexShrink: 0 }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" style={{ padding: "120px 0", background: "var(--how-bg)", transition: "background 0.6s" }}>
        <div className="container" style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <div className="section-header reveal" style={{ textAlign: "center", maxWidth: 640, margin: "0 auto 64px" }}>
            <span style={{ display: "inline-block", fontSize: 13, fontWeight: 600, color: "var(--emerald)", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 16 }}>
              How It Works
            </span>
            <h2 style={{ fontSize: "clamp(32px, 3.5vw, 48px)", fontWeight: 800, color: "var(--grey-900)", lineHeight: 1.15, letterSpacing: "-0.02em", marginBottom: 16 }}>
              Simple steps,<br />massive impact
            </h2>
            <p style={{ fontSize: 17, color: "var(--grey-500)", lineHeight: 1.7 }}>
              From waste scanning to earning rewards, EcoSort AI makes sustainability effortless.
            </p>
          </div>
          <div
            className="steps-grid"
            style={{
              display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 24,
              alignItems: "start", position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute", top: 36, left: 60, right: 60,
                height: 2, background: "linear-gradient(90deg, var(--emerald), var(--sage), var(--mint), var(--aqua), var(--emerald))",
                opacity: 0.3, zIndex: 0,
              }}
            />
            {steps.map((s, i) => (
              <div
                key={s.num}
                className={`step-card reveal ${i === 0 ? "" : `reveal-delay-${i + 1}`}`}
                style={{
                  textAlign: "center", position: "relative", zIndex: 1,
                  padding: "24px 16px", borderRadius: "var(--radius-sm)",
                  background: "var(--glass)", backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  border: "1px solid var(--glass-border)",
                }}
              >
                <div
                  className="step-number"
                  style={{
                    width: 44, height: 44, borderRadius: "50%",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    margin: "0 auto 16px", fontWeight: 700, fontSize: 16,
                    color: "#fff",
                    background: "linear-gradient(135deg, var(--emerald), var(--emerald-light))",
                    boxShadow: "0 4px 16px rgba(45,106,79,0.2)",
                  }}
                >
                  {s.num}
                </div>
                <h4 style={{ fontSize: 16, fontWeight: 700, color: "var(--grey-800)", marginBottom: 8 }}>{s.title}</h4>
                <p style={{ fontSize: 13, color: "var(--grey-500)", lineHeight: 1.6 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── IMPACT ── */}
      <section id="impact" style={{ padding: "120px 0", background: "var(--bg)", transition: "background 0.4s" }}>
        <div className="container" style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <div className="section-header reveal" style={{ textAlign: "center", maxWidth: 640, margin: "0 auto 64px" }}>
            <span style={{ display: "inline-block", fontSize: 13, fontWeight: 600, color: "var(--emerald)", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 16 }}>
              Our Impact
            </span>
            <h2 style={{ fontSize: "clamp(32px, 3.5vw, 48px)", fontWeight: 800, color: "var(--grey-900)", lineHeight: 1.15, letterSpacing: "-0.02em", marginBottom: 16 }}>
              Sustainability in motion
            </h2>
            <p style={{ fontSize: 17, color: "var(--grey-500)", lineHeight: 1.7 }}>
              Real metrics from our growing community of eco-conscious users.
            </p>
          </div>
          <div
            className="stats-grid"
            style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 }}
          >
            {stats.map((s, i) => (
              <div
                key={s.label}
                className={`stat-card reveal ${i === 0 ? "" : `reveal-delay-${i + 1}`}`}
                style={{
                  padding: "36px 24px", borderRadius: "var(--radius-md)",
                  textAlign: "center", background: "var(--stat-card-bg)",
                  backdropFilter: "blur(16px) saturate(1.3)",
                  WebkitBackdropFilter: "blur(16px) saturate(1.3)",
                  border: "1px solid var(--stat-card-border)",
                  boxShadow: "0 4px 24px rgba(45,106,79,0.04)",
                }}
              >
                <div
                  className="stat-icon"
                  style={{
                    width: 48, height: 48, margin: "0 auto 16px",
                    borderRadius: 14, display: "flex", alignItems: "center",
                    justifyContent: "center", background: "var(--social-bg)",
                  }}
                >
                  {s.icon}
                </div>
                <div className="stat-value" style={{ fontSize: "clamp(36px, 3vw, 48px)", fontWeight: 800, color: "var(--grey-900)", lineHeight: 1, marginBottom: 8 }}>
                  <span className="counter" data-target={s.target}>0</span>
                  <span className="suffix" style={{ fontSize: "0.5em", verticalAlign: "super" }}>{s.suffix}</span>
                </div>
                <div className="stat-label" style={{ fontSize: 14, color: "var(--grey-500)", fontWeight: 500 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: "100px 0", background: "var(--cta-bg)", transition: "background 0.6s" }}>
        <div className="container" style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <div className="reveal" style={{ textAlign: "center", maxWidth: 640, margin: "0 auto" }}>
            <span style={{ display: "inline-block", fontSize: 13, fontWeight: 600, color: "var(--emerald)", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 16 }}>
              Get Started
            </span>
            <h2 style={{ fontSize: "clamp(32px, 3.5vw, 48px)", fontWeight: 800, color: "var(--grey-900)", lineHeight: 1.15, letterSpacing: "-0.02em", marginBottom: 20 }}>
              Ready to make a difference?
            </h2>
            <p style={{ fontSize: 17, color: "var(--grey-500)", lineHeight: 1.7, marginBottom: 36 }}>
              Join thousands of users who are transforming waste management with the power of AI.
            </p>
            <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
              <button
                className="btn-primary"
                onClick={() => router.push("/login")}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  fontSize: 16, fontWeight: 600, padding: "16px 32px",
                  borderRadius: 14, border: "none", cursor: "pointer",
                  background: "linear-gradient(135deg, var(--emerald), var(--emerald-light))",
                  color: "#fff", boxShadow: "0 4px 24px rgba(45,106,79,0.25)",
                }}
              >
                <span style={{ position: "relative", zIndex: 1 }}>Get Started Free</span>
              </button>
              <button
                className="btn-secondary"
                onClick={() => router.push("/login")}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  fontSize: 16, fontWeight: 600, padding: "16px 32px",
                  borderRadius: 14, border: "1px solid var(--btn-secondary-border)",
                  cursor: "pointer", background: "var(--btn-secondary-bg)",
                  backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
                  color: "var(--grey-700)",
                  boxShadow: "0 2px 8px var(--shadow-1)",
                }}
              >
                <span style={{ position: "relative", zIndex: 1 }}>Get Started</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer id="about" style={{ padding: "80px 0 32px", background: "var(--footer-bg)", position: "relative" }}>
        <div
          style={{
            position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
            width: "80%", maxWidth: 600, height: 1,
            background: "linear-gradient(90deg, transparent, var(--mint), transparent)",
          }}
        />
        <div className="container" style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <div
            className="footer-grid"
            style={{
              display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1.5fr",
              gap: 48, marginBottom: 48,
            }}
          >
            <div className="footer-brand">
              <a href="/" className="nav-logo" style={{ display: "flex", alignItems: "center", gap: 10, fontWeight: 700, fontSize: 17, color: "#fff", textDecoration: "none", marginBottom: 16 }}>
                <LogoSvg size={30} />
                EcoSort AI
              </a>
              <p style={{ fontSize: 14, color: "var(--grey-500)", lineHeight: 1.7, maxWidth: 320 }}>
                Empowering communities with AI-driven waste segregation and sustainability rewards for a greener tomorrow.
              </p>
              <div className="footer-socials" style={{ display: "flex", gap: 12, marginTop: 16 }}>
                {[
                  { label: "Twitter", path: "M22 4.01c-1 .49-1.98.689-3 .99-1.121-1.265-2.783-1.335-4.38-.737S11.977 5.323 12 7v1c-3.245.083-6.135-1.396-8-4 0 0-4.182 7.433 2 11-1.872 1.247-3.739 2.088-6 2 2.063 1.433 4.393 2.018 7 2 3.823.003 7.257-1.498 9.619-4.521 2.042-2.611 2.888-6.025 2.381-9.479z" },
                  { label: "LinkedIn", path: "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z;M2 9h4v12H2z;M4 4a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" },
                  { label: "GitHub", path: "M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48A10.01 10.01 0 0 0 22 12c0-5.523-4.477-10-10-10z" },
                  { label: "Instagram", path: "" },
                ].map((social) => (
                  <a
                    key={social.label}
                    href="#"
                    aria-label={social.label}
                    style={{
                      width: 40, height: 40, borderRadius: 12,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      background: "var(--social-bg)",
                      border: "1px solid var(--social-border)",
                    }}
                  >
                    {social.label === "Instagram" ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <rect x="2" y="2" width="20" height="20" rx="5" stroke="var(--grey-500)" strokeWidth="1.5" />
                        <circle cx="12" cy="12" r="5" stroke="var(--grey-500)" strokeWidth="1.5" />
                        <circle cx="17.5" cy="6.5" r="1.5" fill="var(--grey-500)" />
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        {social.label === "LinkedIn" ? (
                          <>
                            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" fill="var(--grey-500)" />
                            <rect x="2" y="9" width="4" height="12" rx="1" fill="var(--grey-500)" />
                            <circle cx="4" cy="4" r="2" fill="var(--grey-500)" />
                          </>
                        ) : (
                          <path d={social.path} fill="var(--grey-500)" />
                        )}
                      </svg>
                    )}
                  </a>
                ))}
              </div>
            </div>
            {[
              { title: "Product", links: ["Features", "Pricing", "Integrations", "Changelog"] },
              { title: "Company", links: ["About", "Blog", "Careers", "Press"] },
              { title: "Contact", links: ["hello@ecosort.ai", "+1 (555) 123-4567", "Support Center", "Terms & Privacy"] },
            ].map((col) => (
              <div key={col.title} className="footer-col">
                <h4 style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--grey-700)", marginBottom: 20 }}>{col.title}</h4>
                <ul style={{ display: "flex", flexDirection: "column", gap: 10, listStyle: "none", margin: 0, padding: 0 }}>
                  {col.links.map((link) => (
                    <li key={link}>
                      <a href="#" style={{ fontSize: 14, color: "var(--grey-500)", textDecoration: "none" }}>{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div
            className="footer-quote"
            style={{ textAlign: "center", padding: "32px 0 0", borderTop: "1px solid var(--footer-border)" }}
          >
            <blockquote style={{ fontSize: 15, fontStyle: "italic", color: "var(--grey-500)", maxWidth: 500, margin: "0 auto 12px" }}>
              &ldquo;The greatest threat to our planet is the belief that someone else will save it.&rdquo;
            </blockquote>
            <cite style={{ fontSize: 13, color: "var(--grey-400)", fontStyle: "normal" }}>&mdash; EcoSort AI, Building a Greener Future</cite>
          </div>
          <div className="footer-bottom" style={{ textAlign: "center", marginTop: 24, fontSize: 13, color: "var(--grey-400)" }}>
            &copy; 2026 EcoSort AI. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Responsive styles */}
      <style jsx>{`
        @media (max-width: 1024px) {
          .features-grid { gap: 20px; }
          .steps-grid { gap: 16px; }
          .stats-grid { gap: 16px; }
          .footer-grid { gap: 32px; }
        }
        @media (max-width: 900px) {
          .hero-content { max-width: 100%; margin: 0 auto; }
          .hero-buttons { justify-content: center; }
          .features-grid { grid-template-columns: 1fr; max-width: 480px; margin: 0 auto; }
          .steps-grid { grid-template-columns: 1fr; max-width: 400px; margin: 0 auto; }
          .steps-grid::before { display: none; }
          .step-card { display: flex; align-items: center; gap: 20px; text-align: left; padding: 20px; }
          .step-number { margin: 0; flex-shrink: 0; }
          .stats-grid { grid-template-columns: repeat(2, 1fr); max-width: 500px; margin: 0 auto; }
          .footer-grid { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 768px) {
          .nav-links, .nav-actions { display: none; }
          .hamburger { display: flex; }
          .navbar { height: 54px; padding: 0 18px; top: 12px; width: calc(100% - 24px); }
          .hero { padding: 120px 16px 60px; min-height: auto; }
          .hero h1 { font-size: 38px; }
          .hero-buttons { flex-direction: column; align-items: center; }
          .btn-primary, .btn-secondary { width: 100%; justify-content: center; max-width: 320px; }
          .features { padding: 80px 0; }
          .how-it-works { padding: 80px 0; }
          .impact { padding: 80px 0; }
          .footer { padding: 60px 0 24px; }
        }
        @media (max-width: 480px) {
          .hero h1 { font-size: 32px; }
          .section-title { font-size: 28px; }
          .stats-grid { grid-template-columns: 1fr; }
          .footer-grid { grid-template-columns: 1fr; text-align: center; }
          .footer-brand p { max-width: 100%; }
          .footer-socials { justify-content: center; }
          .step-card { flex-direction: column; text-align: center; }
          .step-number { margin: 0 auto 12px; }
        }
        @media (min-width: 769px) {
          .mobile-menu { display: none !important; }
        }
        .feature-card:hover .feature-card-accent { opacity: 1; }
        .feature-card:hover { transform: translateY(-8px); box-shadow: 0 20px 56px rgba(45,106,79,0.1); }
        .step-card:hover { transform: translateY(-4px); }
        .stat-card:hover { transform: translateY(-6px); box-shadow: 0 12px 40px rgba(45,106,79,0.08); }
        .btn-primary:hover { transform: translateY(-3px); box-shadow: 0 8px 32px rgba(45,106,79,0.35); }
        .btn-secondary:hover { transform: translateY(-3px); border-color: var(--btn-secondary-hover-border); box-shadow: var(--btn-secondary-hover-shadow); }
        .footer-socials a:hover { background: var(--emerald); border-color: var(--emerald); transform: translateY(-2px); }
        .footer-socials a:hover svg path { fill: #fff; }
        .footer-socials a:hover svg rect { stroke: #fff; }
        .footer-socials a:hover svg circle { stroke: #fff; }
        .feature-card, .step-card, .stat-card, .footer-socials a, .stat-icon,
        .hero-badge, .btn-secondary, .feature-icon {
          transition: background 0.4s, color 0.4s, border-color 0.4s, box-shadow 0.4s, transform 0.4s;
        }
      `}</style>
    </div>
  )
}
