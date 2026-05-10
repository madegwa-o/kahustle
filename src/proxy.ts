// proxy.ts
import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

// Define exact public routes that don't require authentication
const PUBLIC_ROUTES = [
    "/",
    "/terms-conditions",
    "/privacy-policy",
    "/register",
    "/signin",
    "/pricing",
    "/about",
    "/api/products",
]

// Define public route prefixes for dynamic pages
const PUBLIC_ROUTE_PREFIXES = [
    "/product/",
    "/vehicles",
    "/properties",
    "/careers",
    "/construction-freelancers",
]

// Define static asset patterns that should always be accessible
const STATIC_ASSETS = [
    "/sw.js",
    "/manifest.json",
    "/logo.png",
    "/favicon.ico",
    "/workbox-",
    "/_next/static",
    "/_next/image",
    "/icons/",
]

// Helper function to check if path matches any pattern
const matchesPattern = (pathname: string, patterns: string[]): boolean => {
    return patterns.some((pattern) => pathname.startsWith(pattern))
}

export default withAuth(
    function proxy(req) {
        const { pathname } = req.nextUrl

        // Allow static assets through without any processing
        if (matchesPattern(pathname, STATIC_ASSETS)) {
            return NextResponse.next()
        }

        const token = req.nextauth.token

        // Redirect signed-in users away from signin page
        if (token && pathname === "/signin") {
            return NextResponse.redirect(new URL("/", req.url))
        }

        return NextResponse.next()
    },
    {
        callbacks: {
            authorized: ({ token, req }) => {
                const { pathname } = req.nextUrl

                // Always allow static assets
                if (matchesPattern(pathname, STATIC_ASSETS)) {
                    return true
                }

                // Allow public routes
                if (PUBLIC_ROUTES.includes(pathname) || matchesPattern(pathname, PUBLIC_ROUTE_PREFIXES)) {
                    return true
                }

                // Auth endpoints are always allowed
                if (pathname.startsWith("/api/auth")) {
                    return true
                }

                // API routes are protected by default
                if (pathname.startsWith("/api/")) {
                    return !!token
                }

                // Everything else requires authentication
                return !!token
            },
        },
        pages: {
            signIn: "/signin",
        },
    }
)

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
}
