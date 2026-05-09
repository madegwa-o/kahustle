"use client";

import { Home, CirclePlus, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function MobileBottomNav() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const tabs = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/?openCreateProduct=true", icon: CirclePlus, label: "Post", isCenter: true },
    { href: "/account", icon: User, label: "Account" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsVisible(!(currentScrollY > lastScrollY && currentScrollY > 80));
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href.startsWith("/?")) return pathname === "/";
    return pathname?.startsWith(href);
  };

  return (
    <nav
      className={`fixed bottom-0 left-0 right-0 z-50 md:hidden transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="mx-auto max-w-md px-4 pb-[calc(env(safe-area-inset-bottom)+10px)] pt-2">
        <div className="relative rounded-[28px] border border-border/60 bg-background/95 shadow-lg backdrop-blur supports-[backdrop-filter]:bg-background/80">
          <div className="absolute left-1/2 top-0 h-16 w-24 -translate-x-1/2 -translate-y-1/2 rounded-b-[999px] border-x border-b border-border/60 bg-background" />

          <div className="relative z-10 grid h-16 grid-cols-3 items-end px-2 pb-2">
            {tabs.map((tab) => {
              const active = isActive(tab.href);
              return (
                <Link key={tab.href} href={tab.href} className="flex flex-col items-center justify-end gap-1">
                  <div
                    className={`flex items-center justify-center rounded-full transition-all ${
                      tab.isCenter
                        ? "-mt-7 h-14 w-14 border border-border/60 bg-primary text-primary-foreground shadow-md"
                        : `h-10 w-10 ${active ? "bg-muted" : ""}`
                    }`}
                  >
                    <tab.icon className="h-5 w-5" />
                  </div>
                  <span className={`text-[11px] ${active || tab.isCenter ? "text-foreground" : "text-muted-foreground"}`}>
                    {tab.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
