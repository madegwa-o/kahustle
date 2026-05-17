"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { Menu, X, LogIn, Tag, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSession, signOut } from "next-auth/react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import useSWR from "swr"

// ─── Types ────────────────────────────────────────────────────────────────────

interface SubCategory {
    label: string
    href: string
}

interface NavCategory {
    label: string
    href: string
    children?: SubCategory[]
}

// ─── Static nav links ─────────────────────────────────────────────────────────

const staticNavLinks: NavCategory[] = [
    { label: "Home", href: "/" },
    { label: "Careers", href: "/careers" },
    { label: "Pricing", href: "/pricing" },
]

const dynamicCategories: { label: string; href: string; slug: string }[] = [
    { label: "Vehicles", href: "/vehicles", slug: "vehicles" },
    { label: "Construction Freelancer", href: "/construction-freelancers", slug: "construction-freelancers" },

    { label: "Properties", href: "/properties", slug: "properties" },
]

const navOrder = [
    "Home",
    "Vehicles",
    "Construction Freelancer",
    "Careers",
    "Properties",
    "Pricing",
    "Contact",
    "About Us",
]

// ─── SWR ──────────────────────────────────────────────────────────────────────

const fetcher = (url: string) => fetch(url).then((res) => res.json())

function useNavCategories() {
    const { data, error, isLoading } = useSWR<Record<string, SubCategory[]>>(
        "/api/categories/nav",
        fetcher,
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
            dedupingInterval: 60 * 60 * 1000,
        }
    )
    return { subcategories: data, error, isLoading }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function buildNavLinks(subcategories?: Record<string, SubCategory[]>): NavCategory[] {
    const dynamic: NavCategory[] = dynamicCategories.map((cat) => ({
        label: cat.label,
        href: cat.href,
        children: subcategories?.[cat.slug] ?? [],
    }))
    const all = [...staticNavLinks, ...dynamic]
    return navOrder
        .map((label) => all.find((l) => l.label === label))
        .filter(Boolean) as NavCategory[]
}

function getUserInitials(name: string | null | undefined) {
    if (!name) return "U"
    const parts = name.split(" ")
    return parts.length >= 2
        ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
        : name.substring(0, 2).toUpperCase()
}

function roleBadgeColor(role: string) {
    switch (role.toUpperCase()) {
        case "ADMIN":  return "bg-red-100 text-red-700 border-red-200"
        case "STAFF":  return "bg-blue-100 text-blue-700 border-blue-200"
        case "EDITOR": return "bg-purple-100 text-purple-700 border-purple-200"
        default:       return "bg-muted text-muted-foreground"
    }
}

// ─── Component ────────────────────────────────────────────────────────────────

export function Navbar() {
    const { data: session, status } = useSession()
    const { subcategories } = useNavCategories()
    const navLinks = buildNavLinks(subcategories)

    const menuRef = useRef<HTMLDivElement>(null)
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [openDropdown, setOpenDropdown] = useState<string | null>(null)

    const roles: string[] = session?.user?.roles ?? []

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false)
            }
        }
        if (isMenuOpen) document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [isMenuOpen])

    const handleSignOut = async () => {
        await signOut({ callbackUrl: "/" })
    }

    return (
        <header
            ref={menuRef}
            className="sticky top-0 z-50 w-full bg-card border-b border-border shadow-sm"
        >
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">

                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 shrink-0">
                    <span className="font-extrabold text-2xl tracking-tight">
                        <span className="text-primary">K</span>
                        <span className="text-foreground">AHUSTLE</span>
                    </span>
                    <span className="hidden sm:block text-[10px] font-semibold text-muted-foreground leading-tight mt-1">
                        Kenyan Owned Classifieds
                    </span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden lg:flex items-center gap-1">
                    {navLinks.map((link) =>
                        link.children && link.children.length > 0 ? (
                            <DropdownMenu key={link.href}>
                                <DropdownMenuTrigger asChild>
                                    <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-foreground rounded-md hover:text-primary hover:bg-secondary transition-colors">
                                        {link.label}
                                        <ChevronDown className="h-3.5 w-3.5" />
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start" className="w-56 max-h-72 overflow-y-auto">
                                    {link.children.map((child) => (
                                        <DropdownMenuItem key={child.href} asChild>
                                            <Link href={child.href} className="cursor-pointer">
                                                {child.label}
                                            </Link>
                                        </DropdownMenuItem>
                                    ))}
                                    {link.children.length > 8 && (
                                        <>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem asChild>
                                                <Link href={link.href} className="cursor-pointer font-medium text-primary">
                                                    View all →
                                                </Link>
                                            </DropdownMenuItem>
                                        </>
                                    )}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="px-3 py-2 text-sm font-medium text-foreground rounded-md hover:text-primary hover:bg-secondary transition-colors"
                            >
                                {link.label}
                            </Link>
                        )
                    )}
                </nav>

                {/* Right Actions */}
                <div className="flex items-center gap-2 shrink-0">
                    <Button
                        size="sm"
                        className="hidden sm:flex items-center gap-1.5 bg-primary hover:opacity-90 text-primary-foreground font-semibold rounded-md"
                        asChild
                    >
                        <Link href="/account">
                            <Tag className="h-4 w-4" />
                            Post Your Ad
                        </Link>
                    </Button>

                    {/* Desktop Auth */}
                    <div className="hidden md:flex items-center">
                        {status === "loading" ? (
                            <div className="h-9 w-9 rounded-full bg-gray-100 animate-pulse" />
                        ) : session?.user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0">
                                        <Avatar className="h-9 w-9">
                                            <AvatarImage
                                                src={session.user.image || undefined}
                                                alt={session.user.name || "User"}
                                            />
                                            <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">
                                                {getUserInitials(session.user.name)}
                                            </AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-60">
                                    <DropdownMenuLabel>
                                        <p className="text-sm font-semibold">{session.user.name}</p>
                                        <p className="text-xs text-muted-foreground mb-2">{session.user.email}</p>
                                        {roles.length > 0 && (
                                            <div className="flex flex-wrap gap-1 mt-1">
                                                {roles.map((role) => (
                                                    <span
                                                        key={role}
                                                        className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${roleBadgeColor(role)}`}
                                                    >
                                                        {role}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild>
                                        <Link href="/account" className="cursor-pointer">My Account</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href="/account?tab=listings" className="cursor-pointer">My Ads</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        onClick={handleSignOut}
                                        className="cursor-pointer text-red-500 focus:text-red-500"
                                    >
                                        Sign Out
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <Button variant="outline" size="sm" asChild className="border-border text-foreground hover:border-primary hover:text-primary">
                                <Link href="/signin">
                                    <LogIn className="mr-1.5 h-4 w-4" />
                                    Login / Register
                                </Link>
                            </Button>
                        )}
                    </div>

                    {/* Mobile Menu Toggle */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="lg:hidden h-9 w-9 text-gray-700"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </Button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="lg:hidden border-t border-border bg-card">
                    <nav className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">

                        {/* Nav Links */}
                        {navLinks.map((link) =>
                            link.children && link.children.length > 0 ? (
                                <div key={link.href}>
                                    <button
                                        className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium text-foreground rounded-md hover:bg-secondary hover:text-primary transition-colors"
                                        onClick={() => setOpenDropdown(openDropdown === link.href ? null : link.href)}
                                    >
                                        {link.label}
                                        <ChevronDown className={`h-4 w-4 transition-transform ${openDropdown === link.href ? "rotate-180" : ""}`} />
                                    </button>
                                    {openDropdown === link.href && (
                                        <div className="ml-4 mt-1 flex flex-col gap-1 border-l-2 border-secondary pl-3 max-h-48 overflow-y-auto">
                                            {link.children.map((child) => (
                                                <Link
                                                    key={child.href}
                                                    href={child.href}
                                                    className="px-3 py-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                                                    onClick={() => setIsMenuOpen(false)}
                                                >
                                                    {child.label}
                                                </Link>
                                            ))}
                                            {link.children.length > 6 && (
                                                <Link
                                                    href={link.href}
                                                    className="px-3 py-2 text-sm font-medium text-primary hover:underline"
                                                    onClick={() => setIsMenuOpen(false)}
                                                >
                                                    View all →
                                                </Link>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="px-3 py-2.5 text-sm font-medium text-foreground rounded-md hover:bg-secondary hover:text-primary transition-colors"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {link.label}
                                </Link>
                            )
                        )}

                        {/* Mobile CTA + Auth */}
                        <div className="mt-3 pt-3 border-t border-border flex flex-col gap-1">
                            <Button
                                className="w-full bg-primary hover:opacity-90 text-primary-foreground font-semibold mb-2"
                                asChild
                                onClick={() => setIsMenuOpen(false)}
                            >
                                <Link href="/account">
                                    <Tag className="mr-2 h-4 w-4" />
                                    Post Your Ad
                                </Link>
                            </Button>

                            {status === "loading" ? (
                                <div className="h-10 w-full rounded-md bg-muted animate-pulse" />
                            ) : session?.user ? (
                                <div className="space-y-1">
                                    {/* User Info */}
                                    <div className="flex items-center gap-3 px-3 py-2">
                                        <Avatar className="h-9 w-9 shrink-0">
                                            <AvatarImage src={session.user.image || undefined} />
                                            <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">
                                                {getUserInitials(session.user.name)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold truncate">{session.user.name}</p>
                                            <p className="text-xs text-muted-foreground truncate">{session.user.email}</p>
                                            {roles.length > 0 && (
                                                <div className="flex flex-wrap gap-1 mt-1">
                                                    {roles.map((role) => (
                                                        <span
                                                            key={role}
                                                            className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${roleBadgeColor(role)}`}
                                                        >
                                                            {role}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Account Links */}
                                    <Link
                                        href="/account"
                                        className="flex w-full items-center px-3 py-2.5 text-sm font-medium text-foreground rounded-md hover:bg-secondary hover:text-primary transition-colors"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        My Account
                                    </Link>
                                    <Link
                                        href="/account?tab=listings"
                                        className="flex w-full items-center px-3 py-2.5 text-sm font-medium text-foreground rounded-md hover:bg-secondary hover:text-primary transition-colors"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        My Ads
                                    </Link>

                                    {/* Sign Out */}
                                    <button
                                        className="flex w-full items-center px-3 py-2.5 text-sm font-medium text-red-500 rounded-md hover:bg-red-50 transition-colors"
                                        onClick={() => { void handleSignOut(); setIsMenuOpen(false) }}
                                    >
                                        Sign Out
                                    </button>
                                </div>
                            ) : (
                                <Button variant="outline" className="w-full" asChild onClick={() => setIsMenuOpen(false)}>
                                    <Link href="/signin">
                                        <LogIn className="mr-2 h-4 w-4" />
                                        Login / Register
                                    </Link>
                                </Button>
                            )}
                        </div>
                    </nav>
                </div>
            )}
        </header>
    )
}