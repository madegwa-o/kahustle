import Link from "next/link"
import {
    Briefcase,
    Home,
    Car,
    Users,
    UserPlus,
    FileText,
    MessageCircle,
    ShoppingBag,
    Star,
    CheckCircle2,
} from "lucide-react"
import { Button } from "@/components/ui/button"

// ─── Data ───────────────────────────────────────────────────────────────────

const offerings = [
    {
        icon: Briefcase,
        text: "Freelance job postings and opportunities",
    },
    {
        icon: Home,
        text: "Property listings for rent and sale",
    },
    {
        icon: Car,
        text: "Vehicle, cars sales and rentals",
    },
    {
        icon: Users,
        text: "Job listings from various industries",
    },
]

const steps = [
    {
        icon: UserPlus,
        label: "Create Account",
        description: "Sign up for free in seconds",
        href: "/signin",
        cta: "Sign Up",
    },
    {
        icon: FileText,
        label: "Post your Ad",
        description: "List what you're selling or offering",
        href: "/post-ad",
        cta: "Post Ad",
    },
    {
        icon: MessageCircle,
        label: "Get Offers",
        description: "Connect with interested buyers",
        href: "/how-it-works",
        cta: "Learn More",
    },
    {
        icon: ShoppingBag,
        label: "Sell Your Item",
        description: "Close the deal and get paid",
        href: "/post-ad",
        cta: "Post Ad",
    },
]

const stats = [
    { value: "1,200+", label: "Listings" },
    { value: "1,000+", label: "Happy Clients" },
    { value: "5,000+", label: "Verified Users" },
]

const testimonials = [
    {
        quote:
            "Got the products delivered in our doorstep quickly, the customer support was super helpful and they answered all my queries in time. Highly recommended!",
        name: "David Kwame",
        title: "CEO, TechHub",
        initials: "DK",
    },
    {
        quote:
            "Got the products delivered in our doorstep quickly, the customer support was super helpful and they answered all my queries in time. Highly recommended!",
        name: "Lilian Wangechi",
        title: "Entrepreneur",
        initials: "LW",
    },
    {
        quote:
            "Got the products delivered in our doorstep quickly, the customer support was super helpful and they answered all my queries in time. Highly recommended!",
        name: "Michael Njuge",
        title: "Journalist, NewAge",
        initials: "MN",
    },
]

// ─── Page ────────────────────────────────────────────────────────────────────

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-background">

            {/* ── Hero ── */}
            <section className="relative bg-[#1a7a3c] text-white overflow-hidden">
                {/* Subtle pattern overlay */}
                <div
                    className="absolute inset-0 opacity-10"
                    style={{
                        backgroundImage:
                            "radial-gradient(circle, white 1px, transparent 1px)",
                        backgroundSize: "32px 32px",
                    }}
                />
                <div className="relative max-w-4xl mx-auto px-6 py-24 text-center">
                    <span className="inline-block bg-white/15 text-white text-xs font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full mb-6">
                        About Us
                    </span>
                    <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4 leading-tight">
                        Welcome to Kahustle
                    </h1>
                    <p className="text-lg sm:text-xl text-green-100 font-medium">
                        Kenya&apos;s Premier Online Classifieds Platform
                    </p>
                </div>
            </section>

            {/* ── About Copy ── */}
            <section className="max-w-4xl mx-auto px-6 py-16">
                <div className="flex flex-col md:flex-row gap-12 items-start">
                    <div className="flex-1">
                        <h2 className="text-2xl font-bold text-foreground mb-4">
                            About Our Company
                        </h2>
                        <div className="w-10 h-1 bg-[#1a7a3c] rounded mb-6" />
                        <p className="text-muted-foreground leading-relaxed text-base">
                            Kahustle is a Kenyan-owned online marketplace designed to connect
                            freelancers, property seekers, buyers, and service providers all in
                            one place. Our mission is to empower Kenyans by offering a safe,
                            easy-to-use, and effective platform for buying, selling, renting,
                            and hiring.
                        </p>
                    </div>

                    {/* What We Offer */}
                    <div className="flex-1 bg-card border border-border rounded-2xl p-8 shadow-sm">
                        <h3 className="text-lg font-bold text-foreground mb-4">
                            What We Offer
                        </h3>
                        <ul className="space-y-4">
                            {offerings.map(({ icon: Icon, text }) => (
                                <li key={text} className="flex items-start gap-3">
                                    <span className="mt-0.5 flex-shrink-0 h-8 w-8 rounded-lg bg-[#1a7a3c]/10 flex items-center justify-center">
                                        <Icon className="h-4 w-4 text-[#1a7a3c]" />
                                    </span>
                                    <span className="text-sm text-muted-foreground leading-relaxed">
                                        {text}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            {/* ── How It Works ── */}
            <section className="bg-muted/50 border-y border-border py-16">
                <div className="max-w-5xl mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl font-bold text-foreground mb-3">
                            How It Works
                        </h2>
                        <div className="w-10 h-1 bg-[#1a7a3c] rounded mx-auto" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {steps.map((step, i) => {
                            const Icon = step.icon
                            return (
                                <div
                                    key={step.label}
                                    className="relative bg-card border border-border rounded-2xl p-6 text-center shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200"
                                >
                                    {/* Step number */}
                                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#1a7a3c] text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                                        {i + 1}
                                    </span>

                                    <div className="mx-auto mb-4 h-12 w-12 rounded-xl bg-[#1a7a3c]/10 flex items-center justify-center">
                                        <Icon className="h-6 w-6 text-[#1a7a3c]" />
                                    </div>

                                    <h4 className="font-bold text-foreground mb-1 text-sm">
                                        {step.label}
                                    </h4>
                                    <p className="text-xs text-muted-foreground mb-4">
                                        {step.description}
                                    </p>

                                    <Button
                                        size="sm"
                                        className="w-full bg-[#1a7a3c] hover:bg-[#155f30] text-white text-xs font-semibold"
                                        asChild
                                    >
                                        <Link href={step.href}>{step.cta}</Link>
                                    </Button>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* ── Stats ── */}
            <section className="max-w-4xl mx-auto px-6 py-16">
                <div className="grid grid-cols-3 gap-6 text-center">
                    {stats.map(({ value, label }) => (
                        <div key={label} className="bg-card border border-border rounded-2xl py-8 px-4 shadow-sm">
                            <p className="text-3xl sm:text-4xl font-extrabold text-[#1a7a3c] mb-1">
                                {value}
                            </p>
                            <p className="text-sm text-muted-foreground font-medium">{label}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Testimonials ── */}
            <section className="bg-[#1a7a3c] py-16">
                <div className="max-w-5xl mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl font-bold text-white mb-3">
                            Customers Say About Us
                        </h2>
                        <div className="w-10 h-1 bg-white/40 rounded mx-auto" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {testimonials.map(({ quote, name, title, initials }) => (
                            <div
                                key={name}
                                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 flex flex-col gap-4"
                            >
                                {/* Stars */}
                                <div className="flex gap-0.5">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <Star
                                            key={i}
                                            className="h-4 w-4 fill-yellow-400 text-yellow-400"
                                        />
                                    ))}
                                </div>

                                <p className="text-sm text-green-50 leading-relaxed flex-1">
                                    &ldquo;{quote}&rdquo;
                                </p>

                                {/* Author */}
                                <div className="flex items-center gap-3 pt-2 border-t border-white/20">
                                    <div className="h-10 w-10 rounded-full bg-white/20 text-white font-bold text-sm flex items-center justify-center shrink-0">
                                        {initials}
                                    </div>
                                    <div>
                                        <p className="text-white font-semibold text-sm">{name}</p>
                                        <p className="text-green-200 text-xs">{title}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA Banner ── */}
            <section className="max-w-4xl mx-auto px-6 py-16 text-center">
                <div className="bg-card border border-border rounded-2xl px-8 py-12 shadow-sm">
                    <CheckCircle2 className="mx-auto h-10 w-10 text-[#1a7a3c] mb-4" />
                    <h3 className="text-2xl font-bold text-foreground mb-3">
                        Ready to get started?
                    </h3>
                    <p className="text-muted-foreground text-sm mb-7 max-w-md mx-auto">
                        Join thousands of Kenyans already buying, selling, and connecting on
                        Kahustle.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Button
                            className="bg-[#1a7a3c] hover:bg-[#155f30] text-white font-semibold px-8"
                            asChild
                        >
                            <Link href="/post-ad">Post Your Ad</Link>
                        </Button>
                        <Button variant="outline" className="border-border font-semibold px-8" asChild>
                            <Link href="/signin">Create Account</Link>
                        </Button>
                    </div>
                </div>
            </section>
        </main>
    )
}