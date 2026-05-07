import Link from "next/link"
import { Check, Building2, Briefcase, Car, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

// ─── Data ────────────────────────────────────────────────────────────────────

const freePlan = {
    name: "Free",
    price: "0",
    duration: "30 Days",
    description: "Get started with basic listings at no cost.",
    features: [
        "Standard listing visibility",
        "Basic contact options",
        "Up to 5 active ads",
    ],
}

const categories = [
    {
        id: "property",
        label: "Property",
        icon: Building2,
        description: "For real estate agents, landlords, and property developers.",
        plans: [
            {
                tier: "Silver",
                price: "5,800",
                duration: "90 Days",
                features: [
                    "Increased ad visibility",
                    "Priority listing in search",
                    "Enhanced contact options",
                    "Ad management tools",
                    "Exclusive promotions & discounts",
                ],
            },
            {
                tier: "Gold",
                price: "6,750",
                duration: "90 Days",
                features: [
                    "Top-tier visibility — highest exposure",
                    "Advanced analytics & metrics",
                    "Priority direct messaging",
                    "Access to premium categories",
                    "All Silver features included",
                ],
                highlight: true,
            },
        ],
    },
    {
        id: "jobs",
        label: "Jobs",
        icon: Briefcase,
        description: "For employers and recruitment agencies posting career opportunities.",
        plans: [
            {
                tier: "Silver",
                price: "4,000",
                duration: "90 Days",
                features: [
                    "Priority listing in search results",
                    "Enhanced contact options",
                    "Ad management tools",
                    "Exclusive promotions",
                ],
            },
            {
                tier: "Gold",
                price: "5,000",
                duration: "90 Days",
                features: [
                    "Top-tier visibility & higher exposure",
                    "Advanced performance analytics",
                    "Priority direct messaging",
                    "Access to premium services",
                    "All Silver features included",
                ],
                highlight: true,
            },
        ],
    },
    {
        id: "vehicles",
        label: "Vehicles",
        icon: Car,
        description: "For car dealers, importers, and individual vehicle sellers.",
        plans: [
            {
                tier: "Silver",
                price: "4,000",
                duration: "90 Days",
                features: [
                    "Priority search visibility",
                    "Enhanced contact options",
                    "Ad management tools",
                    "Exclusive promotions",
                ],
            },
            {
                tier: "Gold",
                price: "5,000",
                duration: "90 Days",
                features: [
                    "Highest search exposure",
                    "Advanced ad performance tracking",
                    "Priority direct messaging",
                    "Access to premium categories",
                    "All Silver features included",
                ],
                highlight: true,
            },
        ],
    },
]

// ─── Sub-components ──────────────────────────────────────────────────────────

function PlanCard({
                      tier,
                      price,
                      duration,
                      features,
                      highlight = false,
                      categoryId,
                  }: {
    tier: string
    price: string
    duration: string
    features: string[]
    highlight?: boolean
    categoryId: string
}) {
    return (
        <div
            className={`relative flex flex-col rounded-2xl border transition-shadow duration-200 hover:shadow-lg ${
                highlight
                    ? "bg-[#1a7a3c] border-[#1a7a3c] text-white shadow-md"
                    : "bg-card border-border text-foreground"
            }`}
        >
            {highlight && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <Badge className="bg-yellow-400 text-yellow-900 font-bold text-xs px-3 py-1 shadow-sm border-0">
                        Most Popular
                    </Badge>
                </div>
            )}

            <div className="p-7 flex flex-col flex-1 gap-6">
                {/* Header */}
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <span
                            className={`inline-block text-xs font-semibold tracking-widest uppercase px-3 py-1 rounded-full ${
                                highlight
                                    ? "bg-white/15 text-white"
                                    : tier === "Gold"
                                        ? "bg-yellow-50 text-yellow-700 border border-yellow-200"
                                        : "bg-muted text-muted-foreground"
                            }`}
                        >
                            {tier}
                        </span>
                    </div>

                    <div className="flex items-end gap-1 mb-1">
                        <span
                            className={`text-sm font-medium ${
                                highlight ? "text-green-200" : "text-muted-foreground"
                            }`}
                        >
                            KSh
                        </span>
                        <span className="text-4xl font-extrabold tracking-tight leading-none">
                            {price}
                        </span>
                    </div>
                    <p
                        className={`text-xs font-medium mt-1 ${
                            highlight ? "text-green-200" : "text-muted-foreground"
                        }`}
                    >
                        Valid for {duration}
                    </p>
                </div>

                {/* Divider */}
                <div
                    className={`h-px w-full ${
                        highlight ? "bg-white/20" : "bg-border"
                    }`}
                />

                {/* Features */}
                <ul className="flex flex-col gap-3 flex-1">
                    {features.map((f) => (
                        <li key={f} className="flex items-start gap-2.5">
                            <span
                                className={`mt-0.5 h-4 w-4 rounded-full flex items-center justify-center shrink-0 ${
                                    highlight ? "bg-white/20" : "bg-[#1a7a3c]/10"
                                }`}
                            >
                                <Check
                                    className={`h-2.5 w-2.5 ${
                                        highlight ? "text-white" : "text-[#1a7a3c]"
                                    }`}
                                    strokeWidth={3}
                                />
                            </span>
                            <span
                                className={`text-sm leading-snug ${
                                    highlight ? "text-green-50" : "text-muted-foreground"
                                }`}
                            >
                                {f}
                            </span>
                        </li>
                    ))}
                </ul>

                {/* CTA */}
                <Button
                    className={`w-full font-semibold h-11 mt-auto ${
                        highlight
                            ? "bg-white text-[#1a7a3c] hover:bg-green-50"
                            : "bg-[#1a7a3c] hover:bg-[#155f30] text-white"
                    }`}
                    asChild
                >
                    <Link href={`/membership/checkout?plan=${categoryId}-${tier.toLowerCase()}`}>
                        Get {tier} Plan
                    </Link>
                </Button>
            </div>
        </div>
    )
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function MembershipPage() {
    return (
        <main className="min-h-screen bg-background">

            {/* ── Hero ── */}
            <section className="relative bg-[#1a7a3c] text-white overflow-hidden">
                <div
                    className="absolute inset-0 opacity-10"
                    style={{
                        backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
                        backgroundSize: "32px 32px",
                    }}
                />
                <div className="relative max-w-3xl mx-auto px-6 py-20 text-center">
                    <span className="inline-block bg-white/15 text-white text-xs font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full mb-5">
                        Membership Plans
                    </span>
                    <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4 leading-tight">
                        Advertise with Greater Reach
                    </h1>
                    <p className="text-green-100 text-base sm:text-lg max-w-xl mx-auto">
                        Upgrade your listing to get seen by more buyers. Choose a plan
                        that fits your category and budget.
                    </p>
                </div>
            </section>

            {/* ── Free Plan Banner ── */}
            <section className="max-w-5xl mx-auto px-6 pt-14 pb-2">
                <div className="bg-card border border-border rounded-2xl p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center shrink-0">
                            <Shield className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-bold text-foreground text-base">
                                    Free Plan
                                </h3>
                                <Badge variant="secondary" className="text-xs">
                                    No cost
                                </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                {freePlan.description} Active for {freePlan.duration}.
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-6 shrink-0">
                        <ul className="hidden md:flex flex-col gap-1">
                            {freePlan.features.map((f) => (
                                <li key={f} className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <Check className="h-3 w-3 text-[#1a7a3c]" strokeWidth={3} />
                                    {f}
                                </li>
                            ))}
                        </ul>
                        <Button variant="outline" className="font-semibold h-10 px-6 border-border" asChild>
                            <Link href="/post-ad">Post for Free</Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* ── Category Sections ── */}
            {categories.map(({ id, label, icon: Icon, description, plans }) => (
                <section key={id} className="max-w-5xl mx-auto px-6 py-12">
                    {/* Section Header */}
                    <div className="flex items-center gap-3 mb-2">
                        <div className="h-9 w-9 rounded-lg bg-[#1a7a3c]/10 flex items-center justify-center">
                            <Icon className="h-5 w-5 text-[#1a7a3c]" />
                        </div>
                        <h2 className="text-xl font-bold text-foreground">{label}</h2>
                    </div>
                    <div className="w-8 h-0.5 bg-[#1a7a3c] rounded mb-3 ml-12" />
                    <p className="text-sm text-muted-foreground mb-8 ml-12">
                        {description}
                    </p>

                    {/* Plan Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl">
                        {plans.map((plan) => (
                            <PlanCard
                                key={plan.tier}
                                {...plan}
                                categoryId={id}
                            />
                        ))}
                    </div>
                </section>
            ))}

            {/* ── Bottom CTA ── */}
            <section className="max-w-3xl mx-auto px-6 py-14 text-center">
                <p className="text-muted-foreground text-sm mb-4">
                    Not sure which plan is right for you?
                </p>
                <Button
                    variant="outline"
                    className="font-semibold border-border h-11 px-8"
                    asChild
                >
                    <Link href="/contact">Talk to Our Team</Link>
                </Button>
            </section>
        </main>
    )
}