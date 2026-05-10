"use client"

import { Home, Plus, User } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

export default function MobileBottomNav() {
  const pathname = usePathname()
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  const tabs = [
    { href: "/",        icon: Home, label: "Home"    },
    { href: "/account", icon: Plus, label: "Post", isCenter: true },
    { href: "/account", icon: User, label: "Account" },
  ]

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      setIsVisible(!(currentScrollY > lastScrollY && currentScrollY > 80))
      setLastScrollY(currentScrollY)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname?.startsWith(href)
  }

  return (
      <nav
          className={`fixed bottom-0 left-0 right-0 z-50 md:hidden transition-transform duration-300 ${
              isVisible ? "translate-y-0" : "translate-y-full"
          }`}
      >
        <div className="mx-auto max-w-md px-4 pb-[calc(env(safe-area-inset-bottom)+10px)] pt-2">
          <div className="relative rounded-[28px] border border-border/60 bg-background/95 shadow-lg backdrop-blur supports-[backdrop-filter]:bg-background/80">

            {/* Notch cutout behind center button — matches button width exactly */}
            <div className="absolute left-1/2 top-0 h-10 w-16 -translate-x-1/2 -translate-y-full rounded-t-full border-x border-t border-border/60 bg-background" />

            <div className="relative z-10 grid h-16 grid-cols-3 items-center px-2">
              {tabs.map((tab) => {
                const active = isActive(tab.href)
                if (tab.isCenter) {
                  return (
                      <Link
                          key={tab.label}
                          href={tab.href}
                          className="flex flex-col items-center gap-1"
                      >
                        {/* Floating button — lifted above the bar */}
                        <div className={`
                                            -mt-8 flex h-14 w-14 items-center justify-center rounded-full
                                            border-2 shadow-md transition-all
                                            ${active
                            ? "border-primary/80 bg-primary/90 text-primary-foreground scale-95"
                            : "border-primary bg-primary text-primary-foreground hover:scale-105"
                        }
                                        `}>
                          <Plus className="h-6 w-6 stroke-[2.5]" />
                        </div>
                        <span className="text-[11px] text-foreground font-medium">
                                            {tab.label}
                                        </span>
                      </Link>
                  )
                }

                return (
                    <Link
                        key={tab.href}
                        href={tab.href}
                        className="flex flex-col items-center gap-1"
                    >
                      <div className={`
                                        flex h-10 w-10 items-center justify-center rounded-full transition-all
                                        ${active ? "bg-muted text-foreground" : "text-muted-foreground"}
                                    `}>
                        <tab.icon className="h-5 w-5" />
                      </div>
                      <span className={`text-[11px] transition-colors ${
                          active ? "text-foreground font-medium" : "text-muted-foreground"
                      }`}>
                                        {tab.label}
                                    </span>
                    </Link>
                )
              })}
            </div>
          </div>
        </div>
      </nav>
  )
}