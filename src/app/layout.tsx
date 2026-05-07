import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";

import { AuthProvider } from "@/components/auth-provider";
import { Analytics } from "@vercel/analytics/next";
import { ThemeProvider } from "@/components/theme-provider";
import { Suspense } from "react";
import MobileBottomNav from "@/components/MobileBottomNav";
import InstallPrompt from "@/components/InstallPrompt";
import AuthErrorHandlerWrapper from "@/components/auth-error-handler-wrapper";
import { NotificationDisplay } from "@/components/notifications/notification-display";
import ChatbotWidget from "@/components/chatbot-widget";
import ContactNav from "@/components/contact-nav";
import { Navbar } from "@/components/navbar";
import Footer from "@/components/footer";

// -----------------
// Font Configuration
// -----------------
const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

// -----------------
// Viewport (Next.js 15+)
// -----------------
export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    themeColor: [
        { media: "(prefers-color-scheme: light)", color: "#FFFFFF" },
        { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" }
    ],
    colorScheme: "light dark"
};

// -----------------
// Metadata
// -----------------
export const metadata: Metadata = {
    metadataBase: new URL("https://kahustle.co.ke"),

    title: {
        default: "Kahustle – Kenya's Hustle Marketplace",
        template: "%s | Kahustle",
    },

    description:
        "Buy, sell and rent cars and properties, find a job or hire a freelancer. Kenya's trusted classifieds platform — safe, convenient, built for the common mwananchi.",

    applicationName: "Kahustle",
    generator: "Next.js",
    manifest: "/manifest.json",

    keywords: [
        "Kahustle",
        "Kenya classifieds",
        "buy and sell Kenya",
        "cars for sale Kenya",
        "houses for rent Nairobi",
        "jobs in Kenya",
        "freelancers Kenya",
        "Kenyan marketplace",
        "online classifieds Kenya",
        "mwananchi marketplace",
        "sell online Kenya",
        "Kenyan e-commerce",
    ],

    authors: [
        {
            name: "Kahustle",
            url: "https://kahustle.co.ke",
        },
    ],

    creator: "Kahustle",
    publisher: "Kahustle",

    icons: {
        icon: [
            { url: "/icons/favicon-16x16.png", sizes: "16x16", type: "image/png" },
            { url: "/icons/favicon-32x32.png", sizes: "32x32", type: "image/png" }
        ],
        apple: "/icons/apple-touch-icon.png",
        other: [
            {
                rel: "mask-icon",
                url: "/icons/android-chrome-192x192.png",
                color: "#1a7a3c"
            }
        ],
    },

    openGraph: {
        type: "website",
        url: "https://kahustle.co.ke",
        title: "Kahustle – Kenya's Hustle Marketplace",
        description:
            "Buy, sell and rent cars and properties, find a job or hire a freelancer. Kenya's trusted classifieds platform.",
        siteName: "Kahustle",
        images: [
            {
                url: "https://kahustle.co.ke/og-image.png",
                width: 1200,
                height: 630,
                alt: "Kahustle – Kenya's Hustle Marketplace"
            }
        ],
    },

    twitter: {
        card: "summary_large_image",
        title: "Kahustle – Kenya's Hustle Marketplace",
        description:
            "Buy, sell and rent cars and properties, find a job or hire a freelancer. Built for the common mwananchi.",
        images: ["https://kahustle.co.ke/og-image.png"],
        creator: "@kahustle"
    },

    category: "classifieds",
    alternates: {
        canonical: "https://kahustle.co.ke/"
    },

    appleWebApp: {
        capable: true,
        title: "Kahustle",
        statusBarStyle: "black-translucent"
    },

    formatDetection: { telephone: false }
};

// -----------------
// Root Layout
// -----------------
export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>
            <ThemeProvider defaultTheme="system" storageKey="theme-pref">
                <Suspense fallback={null}>
                    <ContactNav />
                    <Navbar />
                    {children}
                    <Footer />
                    <Analytics />
                </Suspense>

                <NotificationDisplay />
                <AuthErrorHandlerWrapper />
                <InstallPrompt />
                <MobileBottomNav />
                <ChatbotWidget />
            </ThemeProvider>
        </AuthProvider>

        {/* SEO Structured Data */}
        <Script
            id="structured-data"
            type="application/ld+json"
            dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "WebSite",
                    name: "Kahustle",
                    url: "https://kahustle.co.ke",
                    description:
                        "Kenya's hustle marketplace — buy, sell and rent cars and properties, find a job or hire a freelancer.",
                    potentialAction: {
                        "@type": "SearchAction",
                        target: "https://kahustle.co.ke/?search={search_term_string}",
                        "query-input": "required name=search_term_string"
                    },
                    publisher: {
                        "@type": "Organization",
                        name: "Kahustle",
                        url: "https://kahustle.co.ke"
                    }
                }),
            }}
        />
        </body>
        </html>
    );
}