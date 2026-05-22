"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import {
    Home,
    Car,
    Building2,
    HardHat,
    Briefcase,
    LayoutDashboard,
    List,
    Tag,
    Settings,
    ChevronDown,
    LogIn,
    LogOut,
    ShoppingBag,
    X,
} from "lucide-react"
import { useSession, signOut } from "next-auth/react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import useSWR from "swr"
import { useSidebar } from "@/hooks/sidebar-context"

// ─── Types ────────────────────────────────────────────────────────────────────

interface SubCategory {
    label: string
    href: string
}

interface NavCategory {
    label: string
    href: string
    slug: string
    icon: React.ReactNode
}

// ─── Static data ──────────────────────────────────────────────────────────────

const mainLinks = [
    { label: "Home", href: "/", icon: <Home className="h-[18px] w-[18px]" /> },
]

const categoryLinks: NavCategory[] = [
    { label: "Vehicles",     href: "/vehicles",                slug: "vehicles",                icon: <Car       className="h-[18px] w-[18px]" /> },
    { label: "Properties",   href: "/properties",              slug: "properties",              icon: <Building2 className="h-[18px] w-[18px]" /> },
    { label: "Construction", href: "/construction-freelancers", slug: "construction-freelancers", icon: <HardHat   className="h-[18px] w-[18px]" /> },
]

const accountLinks = [
    { label: "My account", href: "/account",              icon: <LayoutDashboard className="h-[18px] w-[18px]" /> },
    { label: "My ads",     href: "/account?tab=listings", icon: <List            className="h-[18px] w-[18px]" /> },
    { label: "Pricing",    href: "/pricing",              icon: <Tag             className="h-[18px] w-[18px]" /> },
    { label: "Settings",   href: "/settings",             icon: <Settings        className="h-[18px] w-[18px]" /> },
]

// ─── SWR ──────────────────────────────────────────────────────────────────────

const fetcher = (url: string) => fetch(url).then((r) => r.json())

function useNavCategories() {
    const { data, error, isLoading } = useSWR<Record<string, SubCategory[]>>(
        "/api/categories/nav",
        fetcher,
        { revalidateOnFocus: false, revalidateOnReconnect: false, dedupingInterval: 60 * 60 * 1000 }
    )
    const hasData = data && Object.keys(data).length > 0
    return { subcategories: hasData ? data : undefined, error, isLoading }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getUserInitials(name: string | null | undefined) {
    if (!name) return "U"
    const parts = name.trim().split(" ")
    return parts.length >= 2
        ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
        : name.substring(0, 2).toUpperCase()
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
    return (
        <p className="px-3 pt-4 pb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            {children}
        </p>
    )
}

function NavItem({
                     href,
                     icon,
                     label,
                     badge,
                     active,
                     onClick,
                 }: {
    href?: string
    icon: React.ReactNode
    label: string
    badge?: React.ReactNode
    active?: boolean
    onClick?: () => void
}) {
    const cls = cn(
        "flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
        active
            ? "bg-[#EAF3DE] text-[#27500A]"
            : "text-muted-foreground hover:bg-secondary hover:text-foreground"
    )

    if (href) {
        return (
            <Link href={href} className={cls} onClick={onClick}>
                {icon}
                <span className="flex-1">{label}</span>
                {badge}
            </Link>
        )
    }

    return (
        <button type="button" className={cn(cls, "w-full text-left")} onClick={onClick}>
            {icon}
            <span className="flex-1">{label}</span>
            {badge}
        </button>
    )
}

function CategoryItem({
                          cat,
                          subcategories,
                          isOpen,
                          onToggle,
                          pathname,
                          onLinkClick,
                      }: {
    cat: NavCategory
    subcategories?: SubCategory[]
    isOpen: boolean
    onToggle: () => void
    pathname: string
    onLinkClick?: () => void
}) {
    const isActive = pathname.startsWith(cat.href)
    const hasSubs  = subcategories && subcategories.length > 0

    return (
        <div>
            <button
                type="button"
                onClick={onToggle}
                className={cn(
                    "flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                        ? "bg-[#EAF3DE] text-[#27500A]"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
            >
                {cat.icon}
                <span className="flex-1 text-left">{cat.label}</span>
                {hasSubs && (
                    <ChevronDown
                        className={cn(
                            "h-3.5 w-3.5 shrink-0 transition-transform duration-200",
                            isOpen && "rotate-180"
                        )}
                    />
                )}
            </button>

            {hasSubs && isOpen && (
                <div className="ml-4 mt-0.5 flex flex-col border-l border-border pl-3">
                    {subcategories.map((sub) => (
                        <Link
                            key={sub.href}
                            href={sub.href}
                            onClick={onLinkClick}
                            className={cn(
                                "rounded-md px-2 py-1.5 text-[13px] transition-colors",
                                pathname === sub.href
                                    ? "font-medium text-[#27500A]"
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            {sub.label}
                        </Link>
                    ))}
                    {subcategories.length > 6 && (
                        <Link
                            href={cat.href}
                            onClick={onLinkClick}
                            className="rounded-md px-2 py-1.5 text-[13px] font-medium text-[#3B6D11] hover:underline"
                        >
                            View all →
                        </Link>
                    )}
                </div>
            )}
        </div>
    )
}

// ─── Shared sidebar content ───────────────────────────────────────────────────

function SidebarContent({ onLinkClick }: { onLinkClick: () => void }) {
    const pathname   = usePathname()
    const { data: session, status } = useSession()
    const { subcategories } = useNavCategories()
    const { close } = useSidebar()

    const [openCategory, setOpenCategory] = useState<string | null>(() => {
        const match = categoryLinks.find((c) => pathname.startsWith(c.href))
        return match?.slug ?? null
    })

    useEffect(() => {
        const match = categoryLinks.find((c) => pathname.startsWith(c.href))
        if (match) setOpenCategory(match.slug)
    }, [pathname])

    const toggleCategory = (slug: string) =>
        setOpenCategory((prev) => (prev === slug ? null : slug))

    const handleSignOut = () => signOut({ callbackUrl: "/" })

    return (
        <aside className="flex h-full w-64 flex-col overflow-y-auto bg-card">

            {/* Logo */}
            <div className="flex items-center gap-2.5 border-b border-border px-4 py-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#3B6D11]">
                    <ShoppingBag className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1">
                    <p className="text-[15px] font-extrabold tracking-tight leading-none">
                        <span className="text-[#3B6D11]">K</span>
                        <span className="text-foreground">AHUSTLE</span>
                    </p>
                    <p className="text-[10px] text-muted-foreground leading-tight mt-0.5">
                        Kenyan Owned Classifieds
                    </p>
                </div>
                {/* Close button — visible on mobile only */}
                <button
                    type="button"
                    onClick={close}
                    aria-label="Close sidebar"
                    className="lg:hidden flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>

            {/* Post Ad CTA */}
            <div className="px-3 pt-4 pb-2">
                <Link
                    href="/account"
                    onClick={onLinkClick}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#3B6D11] px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                >
                    <Tag className="h-4 w-4" />
                    Post your ad
                </Link>
            </div>

            <div className="mx-3 border-t border-border" />

            {/* Main nav */}
            <div className="px-2">
                <SectionLabel>Main</SectionLabel>
                {mainLinks.map((link) => (
                    <NavItem
                        key={link.href}
                        href={link.href}
                        icon={link.icon}
                        label={link.label}
                        active={pathname === link.href}
                        onClick={onLinkClick}
                    />
                ))}
            </div>

            {/* Categories */}
            <div className="px-2">
                <SectionLabel>Categories</SectionLabel>
                {categoryLinks.map((cat) => (
                    <CategoryItem
                        key={cat.slug}
                        cat={cat}
                        subcategories={subcategories?.[cat.slug]}
                        isOpen={openCategory === cat.slug}
                        onToggle={() => toggleCategory(cat.slug)}
                        pathname={pathname}
                        onLinkClick={onLinkClick}
                    />
                ))}
                <NavItem
                    href="/careers"
                    icon={<Briefcase className="h-[18px] w-[18px]" />}
                    label="Careers"
                    active={pathname.startsWith("/careers")}
                    onClick={onLinkClick}
                />
            </div>

            <div className="mx-3 border-t border-border" />

            {/* Account */}
            <div className="px-2">
                <SectionLabel>Account</SectionLabel>
                {accountLinks.map((link) => (
                    <NavItem
                        key={link.href}
                        href={link.href}
                        icon={link.icon}
                        label={link.label}
                        active={pathname.startsWith(link.href) && link.href !== "/"}
                        onClick={onLinkClick}
                    />
                ))}
            </div>

            <div className="flex-1" />

            {/* User footer */}
            <div className="border-t border-border p-3">
                {status === "loading" ? (
                    <div className="h-12 w-full animate-pulse rounded-lg bg-muted" />
                ) : session?.user ? (
                    <div className="group flex items-center gap-2.5 rounded-lg p-2 transition-colors hover:bg-secondary">
                        <Avatar className="h-8 w-8 shrink-0">
                            <AvatarImage src={session.user.image || undefined} />
                            <AvatarFallback className="bg-[#EAF3DE] text-[#27500A] text-xs font-bold">
                                {getUserInitials(session.user.name)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-[13px] font-medium text-foreground">
                                {session.user.name}
                            </p>
                            <p className="truncate text-[11px] text-muted-foreground">
                                {session.user.email}
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={handleSignOut}
                            className="shrink-0 rounded p-1 text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
                            aria-label="Sign out"
                            title="Sign out"
                        >
                            <LogOut className="h-4 w-4" />
                        </button>
                    </div>
                ) : (
                    <Link
                        href="/signin"
                        onClick={onLinkClick}
                        className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                    >
                        <LogIn className="h-[18px] w-[18px]" />
                        Login / Register
                    </Link>
                )}
            </div>
        </aside>
    )
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function Sidebar() {
    const { isOpen, close } = useSidebar()

    const handleLinkClick = () => {
        if (typeof window !== "undefined" && window.innerWidth < 1024) close()
    }

    return (
        <>
            {/* Desktop: static, always visible */}
            <div className="hidden lg:flex h-screen w-64 shrink-0 border-r border-border">
                <SidebarContent onLinkClick={handleLinkClick} />
            </div>

            {/* Mobile: drawer */}

            {/* Backdrop */}
            <div
                className={cn(
                    "fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 lg:hidden",
                    isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                )}
                onClick={close}
                aria-hidden="true"
            />

            {/* Slide-in panel */}
            <div
                className={cn(
                    "fixed inset-y-0 left-0 z-50 w-64 border-r border-border shadow-2xl transition-transform duration-300 ease-in-out lg:hidden",
                    isOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <SidebarContent onLinkClick={handleLinkClick} />
            </div>
        </>
    )
}