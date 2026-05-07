"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { Menu, X, LogIn, MessageSquare, ChevronDown, Tag } from "lucide-react"
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

const navLinks = [
    { label: "Home", href: "/" },
    {
        label: "Vehicles",
        href: "/vehicles",
        children: [
            { label: "Cars", href: "/vehicles/cars" },
            { label: "Motorbikes & Scooters", href: "/vehicles/motorbikes" },
            { label: "Trucks, Vans & Buses", href: "/vehicles/trucks" },
            { label: "Auto Parts & Accessories", href: "/vehicles/accessories" },
            { label: "Bicycles & 3 Wheelers", href: "/vehicles/bicycles" },
        ]
    },
    {
        label: "Construction Freelancer",
        href: "/construction-freelancers",
        children: [
            { label: "Plumber", href: "/construction-freelancers/plumber" },
            { label: "Building Construction", href: "/construction-freelancers/building-construction" },
            { label: "Electrician", href: "/construction-freelancers/electrician" },
            { label: "Masonry", href: "/construction-freelancers/masonry" },
            { label: "Carpentry", href: "/construction-freelancers/carpentry" },
        ]
    },
    {
        label: "Careers",
        href: "/careers",
        children: [
            { label: "Employers", href: "/careers/employers" },
            { label: "Local Jobs", href: "/careers/local-jobs" },
            { label: "Jobseeker", href: "/careers/jobseekers" },
        ]
    },
    {
        label: "Properties",
        href: "/properties",
        children: [
            { label: "Apartments & Flats", href: "/properties/apartments" },
            { label: "Houses", href: "/properties/houses" },
            { label: "Commercial Property", href: "/properties/commercial" },
            { label: "Plots & Land", href: "/properties/plots" },
        ]
    },
    { label: "Contact", href: "/contact" },
    { label: "About Us", href: "/about" },
]

function getUserInitials(name: string | null | undefined) {
    if (!name) return "U"
    const parts = name.split(" ")
    return parts.length >= 2
        ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
        : name.substring(0, 2).toUpperCase()
}

export function Navbar() {
    const { data: session, status } = useSession()
    const menuRef = useRef<HTMLDivElement>(null)
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [openDropdown, setOpenDropdown] = useState<string | null>(null)

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
                        link.children ? (
                            <DropdownMenu key={link.href}>
                                <DropdownMenuTrigger asChild>
                                    <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-foreground rounded-md hover:text-primary hover:bg-secondary transition-colors">
                                        {link.label}
                                        <ChevronDown className="h-3.5 w-3.5" />
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start" className="w-44">
                                    {link.children.map((child) => (
                                        <DropdownMenuItem key={child.href} asChild>
                                            <Link href={child.href} className="cursor-pointer">
                                                {child.label}
                                            </Link>
                                        </DropdownMenuItem>
                                    ))}
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
                    {/* Live Chat */}
                    <Button
                        variant="ghost"
                        size="sm"
                        className="hidden md:flex items-center gap-1.5 text-muted-foreground hover:text-primary hover:bg-secondary"
                        asChild
                    >
                        <Link href="/live-chat">
                            <MessageSquare className="h-4 w-4" />
                            <span className="text-sm font-medium">Live Chat</span>
                        </Link>
                    </Button>

                    {/* Post Ad CTA */}
                    <Button
                        size="sm"
                        className="hidden sm:flex items-center gap-1.5 bg-primary hover:opacity-90 text-primary-foreground font-semibold rounded-md"
                        asChild
                    >
                        <Link href="/post-ad">
                            <Tag className="h-4 w-4" />
                            Post Your Ad
                        </Link>
                    </Button>

                    {/* Auth */}
                    <div className="hidden md:flex items-center">
                        {status === "loading" ? (
                            <div className="h-9 w-9 rounded-full bg-gray-100 animate-pulse" />
                        ) : session?.user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0">
                                        <Avatar className="h-9 w-9">
                                            <AvatarImage src={session.user.image || undefined} alt={session.user.name || "User"} />
                                            <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">
                                                {getUserInitials(session.user.name)}
                                            </AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56">
                                    <DropdownMenuLabel>
                                        <p className="text-sm font-semibold">{session.user.name}</p>
                                        <p className="text-xs text-muted-foreground">{session.user.email}</p>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild>
                                        <Link href="/account" className="cursor-pointer">My Account</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href="/my-ads" className="cursor-pointer">My Ads</Link>
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
                        {navLinks.map((link) =>
                            link.children ? (
                                <div key={link.href}>
                                    <button
                                        className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium text-foreground rounded-md hover:bg-secondary hover:text-primary transition-colors"
                                        onClick={() => setOpenDropdown(openDropdown === link.href ? null : link.href)}
                                    >
                                        {link.label}
                                        <ChevronDown className={`h-4 w-4 transition-transform ${openDropdown === link.href ? "rotate-180" : ""}`} />
                                    </button>
                                    {openDropdown === link.href && (
                                        <div className="ml-4 mt-1 flex flex-col gap-1 border-l-2 border-secondary pl-3">
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
                        <div className="mt-3 pt-3 border-t border-border flex flex-col gap-2">
                            <Button
                                className="w-full bg-primary hover:opacity-90 text-primary-foreground font-semibold"
                                asChild
                                onClick={() => setIsMenuOpen(false)}
                            >
                                <Link href="/post-ad">
                                    <Tag className="mr-2 h-4 w-4" />
                                    Post Your Ad
                                </Link>
                            </Button>

                            {session?.user ? (
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3 px-1 py-1">
                                        <Avatar className="h-9 w-9">
                                            <AvatarImage src={session.user.image || undefined} />
                                            <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">
                                                {getUserInitials(session.user.name)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="text-sm font-semibold">{session.user.name}</p>
                                            <p className="text-xs text-muted-foreground">{session.user.email}</p>
                                        </div>
                                    </div>
                                    <Button
                                        variant="outline"
                                        className="w-full"
                                        asChild onClick={() => setIsMenuOpen(false)}
                                    >
                                        Sign Out
                                    </Button>
                                </div>
                            ) : (
                                <Button variant="outline" className="w-full border-gray-200" asChild onClick={() => setIsMenuOpen(false)}>
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
