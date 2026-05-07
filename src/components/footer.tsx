import Link from "next/link"

const footerSections = [
    {
        title: "Company",
        links: [
            { label: "About Us", href: "/about" },
            { label: "Advertise with us", href: "/advertise" },
            { label: "Membership", href: "/membership" },
            { label: "Blog / Articles", href: "/blog" },
            { label: "Privacy Policy", href: "/privacy-policy" },
        ],
    },
    {
        title: "How to Sell Fast",
        links: [
            { label: "Property", href: "/properties" },
            { label: "Careers", href: "/careers" },
            { label: "Cars", href: "/cars" },
            { label: "Construction Freelancers", href: "/construction-freelancers" },
        ],
    },
    {
        title: "Information",
        links: [
            { label: "FAQ", href: "/faq" },
            { label: "Terms and Conditions", href: "/terms" },
            { label: "Contact us", href: "/contact" },
        ],
    },
]

const socials = [
    {
        label: "Facebook",
        href: "https://facebook.com",
        bg: "bg-[#1877F2]",
        icon: (
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
            </svg>
        ),
    },
    {
        label: "Instagram",
        href: "https://instagram.com",
        bg: "bg-gradient-to-br from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]",
        icon: (
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
            </svg>
        ),
    },
    {
        label: "TikTok",
        href: "https://tiktok.com",
        bg: "bg-[#010101]",
        icon: (
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z" />
            </svg>
        ),
    },
]

export default function Footer() {
    return (
        <footer className="bg-[#1c1c1c] text-gray-300">
            {/* Main footer grid */}
            <div className="max-w-7xl mx-auto px-6 py-16">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

                    {/* Link columns */}
                    {footerSections.map((section) => (
                        <div key={section.title}>
                            <h3 className="text-white font-semibold text-base mb-3">
                                {section.title}
                            </h3>
                            {/* Green underline accent */}
                            <div className="w-8 h-0.5 bg-[#1a7a3c] mb-5" />
                            <ul className="space-y-3">
                                {section.links.map((link) => (
                                    <li key={link.href}>
                                        <Link
                                            href={link.href}
                                            className="text-sm text-gray-400 hover:text-white transition-colors"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    {/* Connect with Us */}
                    <div>
                        <h3 className="text-white font-semibold text-base mb-3">
                            Connect with Us
                        </h3>
                        <div className="w-8 h-0.5 bg-[#1a7a3c] mb-5" />
                        <div className="flex items-center gap-3">
                            {socials.map((s) => (
                                <Link
                                    key={s.label}
                                    href={s.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={s.label}
                                    className={`${s.bg} text-white h-11 w-11 rounded-full flex items-center justify-center hover:opacity-85 transition-opacity`}
                                >
                                    {s.icon}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom bar */}
            <div className="border-t border-white/10 bg-[#161616]">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-center">
                    <p className="text-xs text-gray-500 text-center">
                        All Rights Reserved. Copyright 2026. Kahustle, Kenya&apos;s Leading Classified Ads Marketplace.
                    </p>
                </div>
            </div>
        </footer>
    )
}