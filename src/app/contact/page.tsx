"use client"

import { useState } from "react"
import Link from "next/link"
import { Phone, Mail, MapPin, Send, ExternalLink, MessageSquare, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

const GOOGLE_MAPS_URL =
    "https://www.google.com/maps/place/Nairobi/@-1.303209,36.8473969,11z/data=!3m1!4b1!4m6!3m5!1s0x182f1172d84d49a7:0xf7cf0254b297924c!8m2!3d-1.2920659!4d36.8219462!16zL20vMDVkNDk?hl=en&entry=ttu"

const contactDetails = [
    {
        icon: Phone,
        label: "Phone",
        value: "+254 710 544 321",
        href: "tel:+254710544321",
    },
    {
        icon: Mail,
        label: "Email",
        value: "info@kahustle.co.ke",
        href: "mailto:info@kahustle.co.ke",
    },
    {
        icon: MapPin,
        label: "Location",
        value: "Nairobi, Kenya",
        href: GOOGLE_MAPS_URL,
        external: true,
    },
    {
        icon: Clock,
        label: "Working Hours",
        value: "Mon – Fri, 8am – 6pm EAT",
        href: null,
    },
]

export default function ContactPage() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
    })
    const [submitted, setSubmitted] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        // TODO: wire up to your API route / email service
        await new Promise((r) => setTimeout(r, 1200))
        setSubmitted(true)
        setLoading(false)
    }

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
                <div className="relative max-w-4xl mx-auto px-6 py-20 text-center">
                    <span className="inline-block bg-white/15 text-white text-xs font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full mb-5">
                        Get in Touch
                    </span>
                    <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
                        Contact Us
                    </h1>
                    <p className="text-green-100 text-base sm:text-lg max-w-xl mx-auto">
                        Have a question or need help? We&apos;re here for you. Reach out and
                        our team will get back to you shortly.
                    </p>
                </div>
            </section>

            {/* ── Main Grid ── */}
            <section className="max-w-6xl mx-auto px-6 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

                    {/* ── Left: Info + Map ── */}
                    <div className="lg:col-span-2 flex flex-col gap-6">

                        {/* Info Card */}
                        <div className="bg-card border border-border rounded-2xl p-7 shadow-sm">
                            <div className="flex items-center gap-2 mb-6">
                                <MessageSquare className="h-5 w-5 text-[#1a7a3c]" />
                                <h2 className="font-bold text-foreground text-lg">Information</h2>
                            </div>

                            <ul className="space-y-5">
                                {contactDetails.map(({ icon: Icon, label, value, href, external }) => (
                                    <li key={label} className="flex items-start gap-4">
                                        <span className="mt-0.5 h-9 w-9 rounded-xl bg-[#1a7a3c]/10 flex items-center justify-center shrink-0">
                                            <Icon className="h-4 w-4 text-[#1a7a3c]" />
                                        </span>
                                        <div>
                                            <p className="text-xs text-muted-foreground font-medium mb-0.5">
                                                {label}
                                            </p>
                                            {href ? (
                                                <Link
                                                    href={href}
                                                    target={external ? "_blank" : undefined}
                                                    rel={external ? "noopener noreferrer" : undefined}
                                                    className="text-sm font-semibold text-foreground hover:text-[#1a7a3c] transition-colors"
                                                >
                                                    {value}
                                                </Link>
                                            ) : (
                                                <p className="text-sm font-semibold text-foreground">
                                                    {value}
                                                </p>
                                            )}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Map Card — click to open Google Maps */}
                        <Link
                            href={GOOGLE_MAPS_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group relative rounded-2xl overflow-hidden border border-border shadow-sm block h-64 lg:flex-1"
                            aria-label="Open Nairobi location in Google Maps"
                        >
                            {/* Static map via OpenStreetMap tile — no API key needed */}
                            <iframe
                                src="https://www.openstreetmap.org/export/embed.html?bbox=36.6219%2C-1.4421%2C37.0219%2C-1.1421&layer=mapnik&marker=-1.2921%2C36.8219"
                                className="w-full h-full border-0 pointer-events-none"
                                title="Nairobi map"
                                loading="lazy"
                            />

                            {/* Hover overlay */}
                            <div className="absolute inset-0 bg-[#1a7a3c]/0 group-hover:bg-[#1a7a3c]/60 transition-all duration-300 flex items-center justify-center">
                                <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-2 bg-white text-[#1a7a3c] font-bold text-sm px-5 py-2.5 rounded-full shadow-lg">
                                    <ExternalLink className="h-4 w-4" />
                                    Get Directions
                                </span>
                            </div>
                        </Link>
                    </div>

                    {/* ── Right: Contact Form ── */}
                    <div className="lg:col-span-3 bg-card border border-border rounded-2xl p-8 shadow-sm">
                        <h2 className="font-bold text-foreground text-lg mb-1">
                            Send Us a Message
                        </h2>
                        <p className="text-muted-foreground text-sm mb-8">
                            Fill in the form below and we&apos;ll respond within 24 hours.
                        </p>

                        {submitted ? (
                            <div className="flex flex-col items-center justify-center py-16 text-center gap-4">
                                <div className="h-16 w-16 rounded-full bg-[#1a7a3c]/10 flex items-center justify-center">
                                    <Send className="h-7 w-7 text-[#1a7a3c]" />
                                </div>
                                <h3 className="font-bold text-xl text-foreground">
                                    Message Sent!
                                </h3>
                                <p className="text-muted-foreground text-sm max-w-xs">
                                    Thanks for reaching out. We&apos;ll be in touch with you shortly.
                                </p>
                                <Button
                                    variant="outline"
                                    className="mt-2"
                                    onClick={() => {
                                        setSubmitted(false)
                                        setForm({ name: "", email: "", phone: "", subject: "", message: "" })
                                    }}
                                >
                                    Send Another Message
                                </Button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-5">
                                {/* Name + Email */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="name" className="text-sm font-medium">
                                            Full Name <span className="text-destructive">*</span>
                                        </Label>
                                        <Input
                                            id="name"
                                            name="name"
                                            placeholder="John Kamau"
                                            value={form.name}
                                            onChange={handleChange}
                                            required
                                            className="bg-background"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label htmlFor="email" className="text-sm font-medium">
                                            Email Address <span className="text-destructive">*</span>
                                        </Label>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            placeholder="john@example.com"
                                            value={form.email}
                                            onChange={handleChange}
                                            required
                                            className="bg-background"
                                        />
                                    </div>
                                </div>

                                {/* Phone + Subject */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="phone" className="text-sm font-medium">
                                            Phone Number
                                        </Label>
                                        <Input
                                            id="phone"
                                            name="phone"
                                            type="tel"
                                            placeholder="+254 7XX XXX XXX"
                                            value={form.phone}
                                            onChange={handleChange}
                                            className="bg-background"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label htmlFor="subject" className="text-sm font-medium">
                                            Subject <span className="text-destructive">*</span>
                                        </Label>
                                        <Input
                                            id="subject"
                                            name="subject"
                                            placeholder="How can we help?"
                                            value={form.subject}
                                            onChange={handleChange}
                                            required
                                            className="bg-background"
                                        />
                                    </div>
                                </div>

                                {/* Message */}
                                <div className="space-y-1.5">
                                    <Label htmlFor="message" className="text-sm font-medium">
                                        Message <span className="text-destructive">*</span>
                                    </Label>
                                    <Textarea
                                        id="message"
                                        name="message"
                                        placeholder="Tell us what's on your mind..."
                                        value={form.message}
                                        onChange={handleChange}
                                        required
                                        rows={6}
                                        className="bg-background resize-none"
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-[#1a7a3c] hover:bg-[#155f30] text-white font-semibold h-11"
                                >
                                    {loading ? (
                                        <span className="flex items-center gap-2">
                                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                            </svg>
                                            Sending...
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-2">
                                            <Send className="h-4 w-4" />
                                            Send Message
                                        </span>
                                    )}
                                </Button>
                            </form>
                        )}
                    </div>
                </div>
            </section>
        </main>
    )
}