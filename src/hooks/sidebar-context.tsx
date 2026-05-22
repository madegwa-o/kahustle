"use client"

import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { usePathname } from "next/navigation"

interface SidebarContextValue {
    isOpen: boolean
    open: () => void
    close: () => void
    toggle: () => void
}

const SidebarContext = createContext<SidebarContextValue | null>(null)

export function SidebarProvider({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    // Desktop: open by default; mobile: closed by default
    const [isOpen, setIsOpen] = useState(false)

    // Set initial state based on screen width (after mount to avoid SSR mismatch)
    useEffect(() => {
        setIsOpen(window.innerWidth >= 1024)
    }, [])

    // Close on route change on mobile
    useEffect(() => {
        if (window.innerWidth < 1024) setIsOpen(false)
    }, [pathname])

    // Close on Escape key
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape") setIsOpen(false)
        }
        document.addEventListener("keydown", handler)
        return () => document.removeEventListener("keydown", handler)
    }, [])

    const open     = useCallback(() => setIsOpen(true),  [])
    const close    = useCallback(() => setIsOpen(false), [])
    const toggle   = useCallback(() => setIsOpen((v) => !v), [])

    return (
        <SidebarContext.Provider value={{ isOpen, open, close, toggle }}>
            {children}
        </SidebarContext.Provider>
    )
}

export function useSidebar() {
    const ctx = useContext(SidebarContext)
    if (!ctx) throw new Error("useSidebar must be used within SidebarProvider")
    return ctx
}