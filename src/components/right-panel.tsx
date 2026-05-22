"use client"

import { useEffect } from "react"
import { X } from "lucide-react"

interface RightPanelProps {
    children: React.ReactNode
    isOpen?: boolean
    onClose?: () => void
    title?: string
}

export function RightPanel({ children, isOpen = false, onClose, title }: RightPanelProps) {
    // Lock body scroll on mobile when open
    useEffect(() => {
        const isMobile = window.innerWidth < 768
        if (isMobile && isOpen) {
            document.body.style.overflow = "hidden"
        }
        return () => {
            document.body.style.overflow = ""
        }
    }, [isOpen])

    return (
        <>
            {/* Mobile backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/40 md:hidden"
                    onClick={onClose}
                />
            )}

            {/* Panel */}
            <aside
                className={`
                    fixed right-0 top-0 z-50 h-full w-72 bg-card border-l border-border
                    shadow-lg overflow-y-auto p-4 transition-transform duration-300
                    md:sticky md:top-0 md:z-auto md:shadow-none md:translate-x-0 md:block md:h-screen md:shrink-0
                    ${isOpen ? "translate-x-0" : "translate-x-full md:translate-x-0"}
                `}
            >
                {/* Header */}
                {(title || onClose) && (
                    <div className="flex items-center justify-between mb-4">
                        {title && (
                            <span className="text-sm font-medium text-foreground">{title}</span>
                        )}
                        {onClose && (
                            <button
                                onClick={onClose}
                                className="ml-auto text-muted-foreground hover:text-foreground transition-colors md:hidden"
                                aria-label="Close panel"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                )}

                {children}
            </aside>
        </>
    )
}