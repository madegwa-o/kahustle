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
    { label: "Cars", href: "/cars" },
    { label: "Properties", href: "/properties" },
    {
        label: "Careers",
        href: "/careers",
        children: [
            { label: "Employer", href: "/careers/employer" },
            { label: "Jobseeker", href: "/careers/jobseeker" },
        ],
    },
    { label: "Construction Freelancers", href: "/construction-freelancers" },
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
    const [careersOpen, setCareersOpen] = useState(false)

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
            className="sticky top-0 z-50 w-full bg-white border-b border-gray-100 shadow-sm"
        >
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">

                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 shrink-0">
                    {/* Replace with <Image> once you have the actual logo asset */}
                    <span className="font-extrabold text-2xl tracking-tight">
                        <span className="text-[#1a7a3c]">K</span>
                        <span className="text-gray-900">AHUSTLE</span>
                    </span>
                    <span className="hidden sm:block text-[10px] font-semibold text-gray-400 leading-tight mt-1">
                        Kenyan Owned Classifieds
                    </span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden lg:flex items-center gap-1">
                    {navLinks.map((link) =>
                        link.children ? (
                            <DropdownMenu key={link.href}>
                                <DropdownMenuTrigger asChild>
                                    <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:text-[#1a7a3c] hover:bg-green-50 transition-colors">
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
                                className="px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:text-[#1a7a3c] hover:bg-green-50 transition-colors"
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
                        className="hidden md:flex items-center gap-1.5 text-gray-600 hover:text-[#1a7a3c] hover:bg-green-50"
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
                        className="hidden sm:flex items-center gap-1.5 bg-[#1a7a3c] hover:bg-[#155f30] text-white font-semibold rounded-md"
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
                                            <AvatarFallback className="bg-[#1a7a3c] text-white text-xs font-bold">
                                                {getUserInitials(session.user.name)}
                                            </AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56">
                                    <DropdownMenuLabel>
                                        <p className="text-sm font-semibold">{session.user.name}</p>
                                        <p className="text-xs text-gray-400">{session.user.email}</p>
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
                            <Button variant="outline" size="sm" asChild className="border-gray-200 text-gray-700 hover:border-[#1a7a3c] hover:text-[#1a7a3c]">
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
                <div className="lg:hidden border-t border-gray-100 bg-white">
                    <nav className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
                        {navLinks.map((link) =>
                            link.children ? (
                                <div key={link.href}>
                                    <button
                                        className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium text-gray-700 rounded-md hover:bg-green-50 hover:text-[#1a7a3c] transition-colors"
                                        onClick={() => setCareersOpen(!careersOpen)}
                                    >
                                        {link.label}
                                        <ChevronDown className={`h-4 w-4 transition-transform ${careersOpen ? "rotate-180" : ""}`} />
                                    </button>
                                    {careersOpen && (
                                        <div className="ml-4 mt-1 flex flex-col gap-1 border-l-2 border-green-100 pl-3">
                                            {link.children.map((child) => (
                                                <Link
                                                    key={child.href}
                                                    href={child.href}
                                                    className="px-3 py-2 text-sm text-gray-600 hover:text-[#1a7a3c] transition-colors"
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
                                    className="px-3 py-2.5 text-sm font-medium text-gray-700 rounded-md hover:bg-green-50 hover:text-[#1a7a3c] transition-colors"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {link.label}
                                </Link>
                            )
                        )}

                        {/* Mobile CTA + Auth */}
                        <div className="mt-3 pt-3 border-t border-gray-100 flex flex-col gap-2">
                            <Button
                                className="w-full bg-[#1a7a3c] hover:bg-[#155f30] text-white font-semibold"
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
                                            <AvatarFallback className="bg-[#1a7a3c] text-white text-xs font-bold">
                                                {getUserInitials(session.user.name)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="text-sm font-semibold">{session.user.name}</p>
                                            <p className="text-xs text-gray-400">{session.user.email}</p>
                                        </div>
                                    </div>
                                    <Button
                                        variant="outline"
                                        className="w-full text-red-500 border-red-100 hover:bg-red-50"
                                        onClick={() => { setIsMenuOpen(false); handleSignOut() }}
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