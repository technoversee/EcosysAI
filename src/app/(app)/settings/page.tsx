"use client"

import { useEffect, useState } from "react"
import { signOut } from "next-auth/react"

interface SettingItem {
  label: string
  desc?: string
  defaultOn: boolean
  id: string
}

interface SettingGroup {
  title: string
  items: SettingItem[]
}

const groups: SettingGroup[] = [
  {
    title: "Notifications",
    items: [
      { label: "Push Notifications", desc: "Receive alerts for recycling reminders", defaultOn: true, id: "push" },
      { label: "Weekly Report", desc: "Get weekly sustainability summary", defaultOn: true, id: "weekly" },
      { label: "Achievement Alerts", desc: "Notify when badges are unlocked", defaultOn: false, id: "achievement" },
    ],
  },
  {
    title: "Privacy",
    items: [
      { label: "Share on Leaderboard", desc: "Allow your name to appear on rankings", defaultOn: true, id: "leaderboard" },
      { label: "Activity Visibility", desc: "Let others see your recycling activity", defaultOn: false, id: "visibility" },
    ],
  },
  {
    title: "Theme",
    items: [
      { label: "Dark Mode", desc: "Switch between light and dark theme", defaultOn: false, id: "darkMode" },
      { label: "Nature Backgrounds", desc: "Rotating nature photos as background (changes every 40s)", defaultOn: false, id: "natureBg" },
    ],
  },
  {
    title: "Support",
    items: [
      { label: "Contact Support", desc: "Get help with your account", defaultOn: false, id: "support" },
      { label: "Privacy Policy", defaultOn: false, id: "privacy" },
      { label: "Terms of Service", defaultOn: false, id: "terms" },
    ],
  },
]

function computeInitial(): Record<string, boolean> {
  if (typeof window === "undefined") return {}
  const saved = localStorage.getItem("ecosort-settings")
  const initial: Record<string, boolean> = {}
  for (const group of groups) {
    for (const item of group.items) {
      initial[item.id] = item.defaultOn
    }
  }
  return saved ? { ...initial, ...JSON.parse(saved) } : initial
}

function useSettings() {
  const [settings, setSettings] = useState<Record<string, boolean>>(computeInitial)

  useEffect(() => {
    if (settings.darkMode) {
      document.documentElement.classList.add("dark")
      localStorage.setItem("ecosort-theme", "dark")
    } else {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("ecosort-theme", "light")
    }
    localStorage.setItem("ecosort-settings", JSON.stringify(settings))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  function toggle(id: string) {
    setSettings((prev) => {
      const next = { ...prev, [id]: !prev[id] }
      if (id === "darkMode") {
        document.documentElement.classList.toggle("dark", next.darkMode)
        localStorage.setItem("ecosort-theme", next.darkMode ? "dark" : "light")
      }
      localStorage.setItem("ecosort-settings", JSON.stringify(next))
      return next
    })
  }

  return { settings, toggle }
}

const linkItems = new Set(["support", "privacy", "terms"])

export default function SettingsPage() {
  const { settings, toggle } = useSettings()

  return (
    <>
      <div className="section-title" style={{ marginTop: 0 }}>Settings</div>
      <div className="card">
        {groups.map((group) => (
          <div key={group.title} className="settings-group">
            <h3>{group.title}</h3>
            {group.items.map((item) => (
              <div key={item.id} className="setting-item">
                <div>
                  <div className="setting-label">{item.label}</div>
                  {item.desc && <div className="setting-desc">{item.desc}</div>}
                </div>
                {linkItems.has(item.id) ? (
                  <span className="card-link">View</span>
                ) : (
                  <div
                    className={`toggle-switch ${settings[item.id] ? "active" : ""}`}
                    onClick={() => toggle(item.id)}
                  />
                )}
              </div>
            ))}
          </div>
        ))}

        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          style={{
            width: "100%", marginTop: 16, padding: 14,
            border: "1.5px solid var(--grey-200)", borderRadius: 10,
            background: "transparent", fontSize: 14, fontWeight: 500,
            fontFamily: "inherit", color: "#e74c3c", cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>
    </>
  )
}
