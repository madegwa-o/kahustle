"use client"

import {MapPin, Phone, Mail, Sun, Moon} from "lucide-react"
import Link from "next/link"
import {Button} from "@/components/ui/button";
import {useTheme} from "@/hooks/theme-provider";

export default function ContactNav() {
    const { theme, setTheme } = useTheme()
    return (
        <div className="w-full bg-[#1a7a3c] text-white text-xs">
            <div className="max-w-7xl mx-auto px-4 h-9 flex items-center justify-between">
                {/* Left: Contact Info */}
                <div className="flex items-center gap-5">
                    <span className="flex items-center gap-1.5 text-green-100">
                        <MapPin className="h-3 w-3 shrink-0" />
                        Nairobi, Kenya
                    </span>
                    <a
                        href="tel:+254710544321"
                        className="flex items-center gap-1.5 text-green-100 hover:text-white transition-colors"
                    >
                        <Phone className="h-3 w-3 shrink-0" />
                        +254 710 544 321
                    </a>
                    <a
                        href="mailto:info@kahustle.co.ke"
                        className="hidden sm:flex items-center gap-1.5 text-green-100 hover:text-white transition-colors"
                    >
                        <Mail className="h-3 w-3 shrink-0" />
                        info@kahustle.co.ke
                    </a>
                </div>

                 {/*Theme Toggle */}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    className="h-9 w-9"
                >
                    <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                </Button>

                {/* Right: Social Icons */}
                <div className="flex items-center gap-3">
                    <Link
                        href="https://facebook.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Facebook"
                        className="text-green-100 hover:text-white transition-colors"
                    >
                        {/* Facebook icon */}
                        <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                        </svg>
                    </Link>
                    <Link
                        href="https://instagram.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Instagram"
                        className="text-green-100 hover:text-white transition-colors"
                    >
                        {/* Instagram icon */}
                        <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="none" stroke="currentColor" strokeWidth="2"/>
                            <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2"/>
                            <circle cx="17.5" cy="6.5" r="1" fill="currentColor"/>
                        </svg>
                    </Link>
                    <Link
                        href="https://tiktok.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="TikTok"
                        className="text-green-100 hover:text-white transition-colors"
                    >
                        {/* TikTok icon */}
                        <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z" />
                        </svg>
                    </Link>
                </div>
            </div>
        </div>
    )
}