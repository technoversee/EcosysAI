"use client"

import { useEffect, useRef, useState, useCallback, FormEvent } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { signIn } from "next-auth/react"

// ── Particle System ──
function useAuthParticles(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
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
        size: Math.random() * 2 + 0.5,
        speedX: (Math.random() - 0.5) * 0.2,
        speedY: (Math.random() - 0.5) * 0.2,
        opacity: Math.random() * 0.3 + 0.05,
        hue: isDark ? 150 + Math.random() * 30 : 120 + Math.random() * 60,
      }
    }

    const count = Math.min(40, Math.floor(canvas.width * canvas.height / 16000))
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
          if (dist < 100) {
            ctx!.beginPath()
            ctx!.moveTo(particles[i].x, particles[i].y)
            ctx!.lineTo(particles[j].x, particles[j].y)
            ctx!.strokeStyle = `hsla(140, 30%, 60%, ${0.05 * (1 - dist / 100)})`
            ctx!.lineWidth = 0.5
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
function useAuthTheme() {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"))
  }, [])

  const toggle = useCallback(() => {
    const next = !document.documentElement.classList.contains("dark")
    document.documentElement.classList.toggle("dark", next)
    setDark(next)
  }, [])

  return { dark, toggle }
}

function LogoSvg({ size = 28 }: { size?: number }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" style={{ width: size, height: size }}>
      <defs>
        <linearGradient id="logo-grad-auth" x1="0" y1="0" x2="32" y2="32">
          <stop offset="0%" stopColor="var(--emerald)" />
          <stop offset="100%" stopColor="var(--mint)" />
        </linearGradient>
      </defs>
      <circle cx="16" cy="16" r="14" fill="url(#logo-grad-auth)" opacity="0.15" />
      <path d="M16 6c-5.523 0-10 4.477-10 10s4.477 10 10 10c2.3 0 4.42-.777 6.121-2.09l-3.182-3.182A5.97 5.97 0 0 1 16 22c-3.314 0-6-2.686-6-6s2.686-6 6-6 6 2.686 6 6v.5l4 4V16c0-5.523-4.477-10-10-10z" fill="var(--emerald)" />
      <path d="M22.5 20.5l4 4-4 4" stroke="var(--mint)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="16" cy="16" r="3" fill="var(--emerald-light)" />
    </svg>
  )
}

function AuthCenterSvg() {
  return (
    <svg viewBox="0 0 120 120" fill="none" style={{ width: "100%", height: "100%" }}>
      <defs>
        <radialGradient id="eco-grad-auth-center" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--emerald)" />
          <stop offset="100%" stopColor="var(--mint)" />
        </radialGradient>
      </defs>
      <circle cx="60" cy="60" r="50" fill="url(#eco-grad-auth-center)" opacity="0.12" />
      <path d="M60 15C35.147 15 15 35.147 15 60c0 24.853 20.147 45 45 45 10.364 0 19.904-3.506 27.473-9.395l-14.318-14.318A26.85 26.85 0 0 1 60 86.25c-14.827 0-26.25-11.423-26.25-26.25S45.173 33.75 60 33.75 86.25 45.173 86.25 60v2.25l17.958 17.958C106.62 74.97 107.5 68.52 107.5 60c0-24.853-20.147-45-45-45h-2.5z" fill="var(--emerald)" opacity="0.7" />
      <circle cx="60" cy="60" r="18" fill="var(--emerald-light)" opacity="0.5" />
      <path d="M96 82l12 12-12 12" stroke="var(--mint)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
      <circle cx="38" cy="38" r="5" fill="var(--mint)" opacity="0.4" />
      <circle cx="82" cy="40" r="4" fill="var(--aqua)" opacity="0.4" />
      <circle cx="44" cy="82" r="3.5" fill="var(--mint-light)" opacity="0.4" />
    </svg>
  )
}

export default function AuthPage() {
  const router = useRouter()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { dark, toggle: toggleTheme } = useAuthTheme()
  const [activeForm, setActiveForm] = useState<"login" | "signup">("login")
  const [animating, setAnimating] = useState(false)

  // Login form state
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [loginError, setLoginError] = useState("")
  const [loginLoading, setLoginLoading] = useState(false)

  // Signup form state
  const [signupName, setSignupName] = useState("")
  const [signupEmail, setSignupEmail] = useState("")
  const [signupPassword, setSignupPassword] = useState("")
  const [signupConfirm, setSignupConfirm] = useState("")
  const [signupError, setSignupError] = useState("")
  const [signupLoading, setSignupLoading] = useState(false)

  useAuthParticles(canvasRef)

  // Navbar scroll effect
  useEffect(() => {
    const navbar = document.getElementById("auth-navbar")
    if (!navbar) return
    function onScroll() {
      navbar!.classList.toggle("scrolled", window.scrollY > 20)
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  function switchForm(form: "login" | "signup") {
    if (animating) return
    setAnimating(true)
    setActiveForm(form)
    setLoginError("")
    setSignupError("")
    setTimeout(() => setAnimating(false), 300)
  }

  // ── LOGIN SUBMIT ──
  async function handleLogin(e: FormEvent) {
    e.preventDefault()
    setLoginError("")
    if (!loginEmail || !loginPassword) {
      setLoginError("Please fill in all fields")
      return
    }
    setLoginLoading(true)
    try {
      const res = await signIn("credentials", {
        email: loginEmail,
        password: loginPassword,
        redirect: false,
      })
      if (res?.error) {
        setLoginError("Invalid email or password")
      } else {
        router.push("/")
        router.refresh()
      }
    } catch {
      setLoginError("Unable to connect to server. Please try again.")
    } finally {
      setLoginLoading(false)
    }
  }

  // ── SIGNUP SUBMIT ──
  async function handleSignup(e: FormEvent) {
    e.preventDefault()
    setSignupError("")
    if (!signupName || !signupEmail || !signupPassword || !signupConfirm) {
      setSignupError("Please fill in all fields")
      return
    }
    if (signupPassword !== signupConfirm) {
      setSignupError("Passwords do not match")
      return
    }
    if (signupPassword.length < 6) {
      setSignupError("Password must be at least 6 characters")
      return
    }
    setSignupLoading(true)
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: signupName, email: signupEmail, password: signupPassword }),
      })
      const data = await res.json()
      if (!res.ok) {
        setSignupError(data.message || "Signup failed")
        return
      }
      // Auto-login after signup
      const signInRes = await signIn("credentials", {
        email: signupEmail,
        password: signupPassword,
        redirect: false,
      })
      if (signInRes?.error) {
        setSignupError("Account created but sign-in failed. Please log in.")
        switchForm("login")
      } else {
        router.push("/")
        router.refresh()
      }
    } catch {
      setSignupError("Unable to connect to server. Please try again.")
    } finally {
      setSignupLoading(false)
    }
  }

  return (
    <div style={{
      fontFamily: "'Inter', sans-serif",
      background: "var(--auth-bg)",
      color: "var(--grey-800)",
      minHeight: "100vh",
      position: "relative",
    }}>
      {/* ── NAVBAR ── */}
      <nav
        id="auth-navbar"
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
          transition: "background 0.4s, border 0.4s",
        }}
      >
        <Link href="/" className="nav-logo" style={{ display: "flex", alignItems: "center", gap: 10, fontWeight: 700, fontSize: 17, color: "var(--grey-800)", textDecoration: "none" }}>
          <LogoSvg size={28} />
          EcoSort AI
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
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
          <Link
            href="/"
            className="nav-back"
            style={{
              display: "flex", alignItems: "center", gap: 6,
              fontSize: 14, fontWeight: 500, color: "var(--grey-500)",
              padding: "6px 14px", borderRadius: 10, textDecoration: "none",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
            </svg>
            Back to Home
          </Link>
        </div>
      </nav>

      {/* ── AUTH MAIN ── */}
      <main
        style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          minHeight: "100vh", padding: "100px 24px 60px",
          position: "relative", overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute", inset: 0,
            background: "var(--ring-glow-auth)",
            pointerEvents: "none",
          }}
        />
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute", top: 0, left: 0,
            width: "100%", height: "100%", pointerEvents: "none", zIndex: 0,
          }}
        />
        <div
          className="auth-container"
          style={{
            position: "relative", zIndex: 1,
            display: "grid", gridTemplateColumns: "1fr 1fr",
            gap: 64, alignItems: "center",
            width: "100%", maxWidth: 1120,
          }}
        >
          {/* ── ILLUSTRATION SIDE ── */}
          <div
            className="auth-illustration"
            style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}
          >
            <div style={{ position: "relative", width: "100%", maxWidth: 420, aspectRatio: 1, marginBottom: 40 }}>
              <div
                className="glow-ring"
                style={{
                  position: "absolute", top: "50%", left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: "85%", height: "85%", borderRadius: "50%",
                  background: "var(--ring-glow-auth)",
                  animation: "auth-pulse 4s ease-in-out infinite",
                }}
              />
              <div
                className="ring-spin"
                style={{
                  position: "absolute", top: "50%", left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: "60%", height: "60%", borderRadius: "50%",
                  border: "1px solid var(--input-border)",
                  animation: "auth-spin 20s linear infinite",
                }}
              />
              <div
                className="ring-spin-reverse"
                style={{
                  position: "absolute", top: "50%", left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: "75%", height: "75%", borderRadius: "50%",
                  border: "1px dashed var(--input-border)",
                  animation: "auth-spin-reverse 25s linear infinite",
                }}
              />
              <div
                className="center-icon"
                style={{
                  position: "absolute", top: "50%", left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: "32%", height: "32%",
                }}
              >
                <AuthCenterSvg />
              </div>
              {/* Auth floating elements */}
              {[
                { top: "6%", left: "6%", delay: "0s", content: <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><path d="M14 2L4 9v10l10 7 10-7V9L14 2z" fill="var(--mint)" opacity="0.35" /></svg> },
                { top: "4%", right: "8%", delay: "1.8s", content: <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="var(--emerald)" strokeWidth="1.5" opacity="0.25" strokeDasharray="3 3" /></svg> },
                { bottom: "10%", left: "4%", delay: "3s", content: <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><rect x="2" y="2" width="18" height="18" rx="3" stroke="var(--mint)" strokeWidth="1.5" opacity="0.25" /><path d="M11 8l-4 6h8l-4-6z" fill="var(--mint)" opacity="0.15" /></svg> },
                { bottom: "6%", right: "6%", delay: "1s", content: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="8" fill="var(--aqua)" opacity="0.12" /><circle cx="10" cy="10" r="4" fill="var(--emerald)" opacity="0.15" /></svg> },
                { top: "42%", left: "0%", delay: "2.4s", content: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 1L1 9l8 8 8-8L9 1z" fill="var(--sage)" opacity="0.1" /></svg> },
              ].map((item, i) => (
                <div
                  key={i}
                  className="auth-float"
                  style={{
                    position: "absolute",
                    top: item.top, left: item.left, bottom: item.bottom, right: item.right,
                    animation: "auth-float 6s ease-in-out infinite",
                    animationDelay: item.delay,
                    opacity: 0.5,
                  }}
                >
                  {item.content}
                </div>
              ))}
            </div>
            <div className="auth-illustration-text" style={{ maxWidth: 380 }}>
              <h2 style={{ fontSize: 28, fontWeight: 800, color: "var(--grey-900)", marginBottom: 12, letterSpacing: "-0.02em" }}>
                Join <span style={{ background: "linear-gradient(135deg, var(--emerald), var(--mint))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>EcoSort AI</span>
              </h2>
              <p style={{ fontSize: 15, color: "var(--grey-500)", lineHeight: 1.7 }}>
                Empowering communities with AI-driven waste segregation for a smarter, greener future.
              </p>
              <div className="eco-stats" style={{ display: "flex", gap: 24, justifyContent: "center", marginTop: 24 }}>
                <div style={{ textAlign: "center" }}>
                  <strong style={{ display: "block", fontSize: 20, fontWeight: 800, color: "var(--emerald)" }}>12.8K+</strong>
                  <span style={{ fontSize: 12, color: "var(--grey-400)", fontWeight: 500 }}>Active Users</span>
                </div>
                <div style={{ textAlign: "center" }}>
                  <strong style={{ display: "block", fontSize: 20, fontWeight: 800, color: "var(--emerald)" }}>3.8K</strong>
                  <span style={{ fontSize: 12, color: "var(--grey-400)", fontWeight: 500 }}>Tonnes Recycled</span>
                </div>
                <div style={{ textAlign: "center" }}>
                  <strong style={{ display: "block", fontSize: 20, fontWeight: 800, color: "var(--emerald)" }}>5.6K+</strong>
                  <span style={{ fontSize: 12, color: "var(--grey-400)", fontWeight: 500 }}>Rewards Claimed</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── AUTH CARD ── */}
          <div
            className="glass-card"
            style={{
              padding: "48px 40px", width: "100%", maxWidth: 460, margin: "0 auto",
              borderRadius: "var(--radius-lg)",
              transition: "background 0.4s, border 0.4s, box-shadow 0.4s, transform 0.3s, opacity 0.3s",
            }}
          >
            {/* ── LOGIN ── */}
            <div
              style={{
                transition: "opacity 0.4s, transform 0.4s",
                opacity: activeForm === "login" ? 1 : 0,
                transform: activeForm === "login" ? "translateX(0)" : "translateX(-20px)",
                display: activeForm === "login" ? "block" : "none",
              }}
            >
              <div className="auth-card-header" style={{ textAlign: "center", marginBottom: 36 }}>
                <h1 style={{ fontSize: 30, fontWeight: 800, color: "var(--grey-900)", letterSpacing: "-0.02em", marginBottom: 8 }}>Welcome Back</h1>
                <p style={{ fontSize: 15, color: "var(--grey-500)", lineHeight: 1.6 }}>Continue your sustainability journey with EcoSort AI.</p>
              </div>
              <form onSubmit={handleLogin} className="auth-form" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <div className="input-group">
                  <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "var(--label-color)", marginBottom: 6 }}>Email</label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    style={{
                      width: "100%", padding: "14px 16px", fontSize: 15, fontFamily: "inherit",
                      color: "var(--grey-800)", background: "var(--input-bg)",
                      border: "1.5px solid var(--input-border)", borderRadius: "var(--radius-sm)",
                      outline: "none", boxSizing: "border-box",
                    }}
                  />
                </div>
                <div className="input-group">
                  <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "var(--label-color)", marginBottom: 6 }}>Password</label>
                  <input
                    type="password"
                    placeholder="Enter your password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    style={{
                      width: "100%", padding: "14px 16px", fontSize: 15, fontFamily: "inherit",
                      color: "var(--grey-800)", background: "var(--input-bg)",
                      border: "1.5px solid var(--input-border)", borderRadius: "var(--radius-sm)",
                      outline: "none", boxSizing: "border-box",
                    }}
                  />
                </div>
                <div className="form-row" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 14 }}>
                  <label style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--grey-500)", cursor: "pointer" }}>
                    <input type="checkbox" defaultChecked style={{ width: 16, height: 16, accentColor: "var(--emerald)" }} />
                    Remember me
                  </label>
                  <a href="#" style={{ color: "var(--switch-link)", fontWeight: 500, textDecoration: "none" }}>Forgot Password?</a>
                </div>
                {loginError && (
                  <div style={{ color: "var(--error-color)", fontSize: 13 }}>{loginError}</div>
                )}
                <button
                  type="submit"
                  disabled={loginLoading}
                  style={{
                    width: "100%", padding: "15px 24px", fontSize: 16, fontWeight: 600,
                    fontFamily: "inherit", border: "none", borderRadius: "var(--radius-sm)",
                    cursor: loginLoading ? "not-allowed" : "pointer",
                    background: loginLoading
                      ? "var(--grey-400)"
                      : "linear-gradient(135deg, var(--emerald), var(--emerald-light))",
                    color: "#fff",
                    boxShadow: loginLoading ? "none" : "0 4px 20px rgba(45,106,79,0.2)",
                    opacity: loginLoading ? 0.7 : 1,
                  }}
                >
                  <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                    {loginLoading ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: "spin 1s linear infinite" }}>
                        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                        <polyline points="10 17 15 12 10 7" /><line x1="15" y1="12" x2="3" y2="12" />
                      </svg>
                    )}
                    {loginLoading ? "Logging in..." : "Log In"}
                  </span>
                </button>
                <div className="divider" style={{ display: "flex", alignItems: "center", gap: 16, margin: "8px 0", color: "var(--divider-color)", fontSize: 13 }}>
                  <span style={{ flex: 1, height: 1, background: "var(--divider-color)" }} />
                  or continue with
                  <span style={{ flex: 1, height: 1, background: "var(--divider-color)" }} />
                </div>
                <div className="social-buttons" style={{ display: "flex", gap: 12 }}>
                  <button type="button" className="btn-social" style={{
                    flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
                    gap: 8, padding: 12, fontSize: 14, fontWeight: 500, fontFamily: "inherit",
                    color: "var(--grey-700)", background: "var(--social-bg)",
                    border: "1px solid var(--social-border)", borderRadius: "var(--radius-sm)",
                    cursor: "pointer",
                  }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
                    Google
                  </button>
                  <button type="button" className="btn-social" style={{
                    flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
                    gap: 8, padding: 12, fontSize: 14, fontWeight: 500, fontFamily: "inherit",
                    color: "var(--grey-700)", background: "var(--social-bg)",
                    border: "1px solid var(--social-border)", borderRadius: "var(--radius-sm)",
                    cursor: "pointer",
                  }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" fill="var(--grey-700)" /></svg>
                    Apple
                  </button>
                </div>
                <div className="auth-switch" style={{ textAlign: "center", marginTop: 24, fontSize: 14, color: "var(--switch-color)" }}>
                  Don&apos;t have an account?{" "}
                  <a onClick={() => switchForm("signup")} style={{ color: "var(--switch-link)", fontWeight: 600, cursor: "pointer" }}>Sign Up</a>
                </div>
              </form>
            </div>

            {/* ── SIGNUP ── */}
            <div
              style={{
                transition: "opacity 0.4s, transform 0.4s",
                opacity: activeForm === "signup" ? 1 : 0,
                transform: activeForm === "signup" ? "translateX(0)" : "translateX(20px)",
                display: activeForm === "signup" ? "block" : "none",
              }}
            >
              <div className="auth-card-header" style={{ textAlign: "center", marginBottom: 36 }}>
                <h1 style={{ fontSize: 30, fontWeight: 800, color: "var(--grey-900)", letterSpacing: "-0.02em", marginBottom: 8 }}>Create Your Eco Account</h1>
                <p style={{ fontSize: 15, color: "var(--grey-500)", lineHeight: 1.6 }}>Join the AI-powered sustainability ecosystem.</p>
              </div>
              <form onSubmit={handleSignup} className="auth-form" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <div className="input-group">
                  <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "var(--label-color)", marginBottom: 6 }}>Full Name</label>
                  <input
                    type="text"
                    placeholder="Jane Doe"
                    required
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    style={{
                      width: "100%", padding: "14px 16px", fontSize: 15, fontFamily: "inherit",
                      color: "var(--grey-800)", background: "var(--input-bg)",
                      border: "1.5px solid var(--input-border)", borderRadius: "var(--radius-sm)",
                      outline: "none", boxSizing: "border-box",
                    }}
                  />
                </div>
                <div className="input-group">
                  <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "var(--label-color)", marginBottom: 6 }}>Email</label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    required
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    style={{
                      width: "100%", padding: "14px 16px", fontSize: 15, fontFamily: "inherit",
                      color: "var(--grey-800)", background: "var(--input-bg)",
                      border: "1.5px solid var(--input-border)", borderRadius: "var(--radius-sm)",
                      outline: "none", boxSizing: "border-box",
                    }}
                  />
                </div>
                <div className="input-group">
                  <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "var(--label-color)", marginBottom: 6 }}>Password</label>
                  <input
                    type="password"
                    placeholder="Create a strong password"
                    required
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    style={{
                      width: "100%", padding: "14px 16px", fontSize: 15, fontFamily: "inherit",
                      color: "var(--grey-800)", background: "var(--input-bg)",
                      border: "1.5px solid var(--input-border)", borderRadius: "var(--radius-sm)",
                      outline: "none", boxSizing: "border-box",
                    }}
                  />
                </div>
                <div className="input-group">
                  <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "var(--label-color)", marginBottom: 6 }}>Confirm Password</label>
                  <input
                    type="password"
                    placeholder="Confirm your password"
                    required
                    value={signupConfirm}
                    onChange={(e) => setSignupConfirm(e.target.value)}
                    style={{
                      width: "100%", padding: "14px 16px", fontSize: 15, fontFamily: "inherit",
                      color: "var(--grey-800)", background: "var(--input-bg)",
                      border: "1.5px solid var(--input-border)", borderRadius: "var(--radius-sm)",
                      outline: "none", boxSizing: "border-box",
                    }}
                  />
                </div>
                {signupError && (
                  <div style={{ color: "var(--error-color)", fontSize: 13 }}>{signupError}</div>
                )}
                <button
                  type="submit"
                  disabled={signupLoading}
                  style={{
                    width: "100%", padding: "15px 24px", fontSize: 16, fontWeight: 600,
                    fontFamily: "inherit", border: "none", borderRadius: "var(--radius-sm)",
                    cursor: signupLoading ? "not-allowed" : "pointer",
                    background: signupLoading
                      ? "var(--grey-400)"
                      : "linear-gradient(135deg, var(--emerald), var(--emerald-light))",
                    color: "#fff",
                    boxShadow: signupLoading ? "none" : "0 4px 20px rgba(45,106,79,0.2)",
                    opacity: signupLoading ? 0.7 : 1,
                  }}
                >
                  <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                    {signupLoading ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: "spin 1s linear infinite" }}>
                        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="8.5" cy="7" r="4" /><line x1="20" y1="8" x2="20" y2="14" /><line x1="23" y1="11" x2="17" y2="11" />
                      </svg>
                    )}
                    {signupLoading ? "Creating Account..." : "Create Account"}
                  </span>
                </button>
                <div className="divider" style={{ display: "flex", alignItems: "center", gap: 16, margin: "8px 0", color: "var(--divider-color)", fontSize: 13 }}>
                  <span style={{ flex: 1, height: 1, background: "var(--divider-color)" }} />
                  or sign up with
                  <span style={{ flex: 1, height: 1, background: "var(--divider-color)" }} />
                </div>
                <div className="social-buttons" style={{ display: "flex", gap: 12 }}>
                  <button type="button" className="btn-social" style={{
                    flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
                    gap: 8, padding: 12, fontSize: 14, fontWeight: 500, fontFamily: "inherit",
                    color: "var(--grey-700)", background: "var(--social-bg)",
                    border: "1px solid var(--social-border)", borderRadius: "var(--radius-sm)",
                    cursor: "pointer",
                  }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
                    Google
                  </button>
                  <button type="button" className="btn-social" style={{
                    flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
                    gap: 8, padding: 12, fontSize: 14, fontWeight: 500, fontFamily: "inherit",
                    color: "var(--grey-700)", background: "var(--social-bg)",
                    border: "1px solid var(--social-border)", borderRadius: "var(--radius-sm)",
                    cursor: "pointer",
                  }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" fill="var(--grey-700)" /></svg>
                    Apple
                  </button>
                </div>
                <div className="auth-switch" style={{ textAlign: "center", marginTop: 24, fontSize: 14, color: "var(--switch-color)" }}>
                  Already have an account?{" "}
                  <a onClick={() => switchForm("login")} style={{ color: "var(--switch-link)", fontWeight: 600, cursor: "pointer" }}>Log In</a>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>

      <style jsx>{`
        @media (max-width: 1024px) {
          .auth-container { gap: 40px; }
        }
        @media (max-width: 900px) {
          .auth-container { grid-template-columns: 1fr; gap: 0; }
          .auth-illustration { display: none; }
          .auth-card { max-width: 440px; padding: 40px 32px; }
        }
        @media (max-width: 768px) {
          .navbar { height: 54px; padding: 0 18px; top: 12px; width: calc(100% - 24px); }
          .auth-main { padding: 90px 16px 40px; }
          .auth-card { padding: 32px 24px; border-radius: var(--radius-md); }
          .auth-card-header h1 { font-size: 26px; }
          .auth-card-header { margin-bottom: 28px; }
          .auth-form { gap: 16px; }
          .social-buttons { flex-direction: column; }
        }
        @media (max-width: 480px) {
          .auth-card { padding: 28px 20px; }
          .auth-card-header h1 { font-size: 24px; }
          .auth-card-header p { font-size: 14px; }
          .input-group input { padding: 12px 14px; font-size: 14px; }
          .btn-auth { padding: 14px 20px; }
          .form-row { flex-direction: column; gap: 12px; align-items: flex-start; }
        }
        input:focus {
          border-color: var(--input-focus-border) !important;
          box-shadow: var(--input-focus-shadow) !important;
        }
        .btn-social:hover {
          background: var(--social-hover-bg);
          border-color: var(--social-hover-border);
          transform: translateY(-1px);
        }
        .btn-auth:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(45,106,79,0.3); }
        .nav-back:hover { background: rgba(45,106,79,0.06); color: var(--emerald); }
        .theme-toggle:hover { background: rgba(45,106,79,0.06); color: var(--emerald); }
      `}</style>
    </div>
  )
}
