"use client"

import { usePathname, useRouter } from "next/navigation"

const mobileNavItems = [
  {
    id: "dashboard",
    label: "Home",
    href: "/dashboard",
    icon: "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect x=\"3\" y=\"3\" width=\"7\" height=\"7\"/><rect x=\"14\" y=\"3\" width=\"7\" height=\"7\"/><rect x=\"14\" y=\"14\" width=\"7\" height=\"7\"/><rect x=\"3\" y=\"14\" width=\"7\" height=\"7\"/></svg>",
  },
  {
    id: "scan",
    label: "Scan",
    href: "/scan",
    icon: "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z\"/><circle cx=\"12\" cy=\"12\" r=\"3\"/></svg>",
  },
  {
    id: "rewards",
    label: "Rewards",
    href: "/rewards",
    icon: "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"12\" cy=\"12\" r=\"10\"/><path d=\"M8 12l2 2 4-4\"/></svg>",
  },
  {
    id: "analytics",
    label: "Stats",
    href: "/analytics",
    icon: "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><line x1=\"18\" y1=\"20\" x2=\"18\" y2=\"10\"/><line x1=\"12\" y1=\"20\" x2=\"12\" y2=\"4\"/><line x1=\"6\" y1=\"20\" x2=\"6\" y2=\"14\"/></svg>",
  },
  {
    id: "profile",
    label: "Profile",
    href: "/profile",
    icon: "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2\"/><circle cx=\"12\" cy=\"7\" r=\"4\"/></svg>",
  },
]

export default function AppBottomNav() {
  const pathname = usePathname()
  const router = useRouter()

  const currentPath = pathname.split("/").filter(Boolean)[0] || "dashboard"

  return (
    <nav className="mobile-bottom-nav" id="bottomNav">
      {mobileNavItems.map((item) => (
        <button
          key={item.id}
          className={`mob-nav-item${currentPath === item.id ? " active" : ""}`}
          onClick={() => router.push(item.href)}
          dangerouslySetInnerHTML={{ __html: item.icon + "<span>" + item.label + "</span>" }}
        />
      ))}
    </nav>
  )
}
