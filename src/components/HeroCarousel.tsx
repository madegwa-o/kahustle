"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"

const slides = [
    {
        image: "/carosel/logo.png",
        title: "Your Hustle Marketplace",
        description: "Buy, sell and rent cars and properties, find a job or be a freelancer.",
        href: "https://chat.whatsapp.com/?mode=wwt",
    },
    {
        image: "/carosel/car.png",
        title: "Find Your Dream Car",
        description: "Browse thousands of verified car listings from trusted sellers across Kenya.",
        href: "/listings?category=cars",
    },
    {
        image: "/carosel/land.png",
        title: "Property for Every Budget",
        description: "Rent or buy homes, apartments and land. Safe, convenient, built for mwananchi.",
        href: "/listings?category=property",
    },
    {
        image: "/carosel/freelancer.png",
        title: "Jobs & Freelance Work",
        description: "Post a job or offer your skills. Connect with opportunities across Kenya.",
        href: "/listings?category=jobs",
    },
]

export default function HeroCarousel() {
    const [current, setCurrent] = useState(0)
    const [isTransitioning, setIsTransitioning] = useState(false)

    const goTo = useCallback((index: number) => {
        if (isTransitioning) return
        setIsTransitioning(true)
        setCurrent(index)
        setTimeout(() => setIsTransitioning(false), 400)
    }, [isTransitioning])

    const prev = () => goTo((current - 1 + slides.length) % slides.length)
    const next = useCallback(() => goTo((current + 1) % slides.length), [current, goTo])

    // Auto-advance every 5s
    useEffect(() => {
        const timer = setInterval(next, 5000)
        return () => clearInterval(timer)
    }, [next])

    return (
        <div className="relative mb-12 w-full max-w-2xl rounded-2xl overflow-hidden group">
            {/* Slides */}
            <div className="relative h-64 sm:h-80">
                {slides.map((slide, i) => (
                    <Link
                        key={i}
                        href={slide.href}
                        target={slide.href.startsWith("http") ? "_blank" : undefined}
                        rel={slide.href.startsWith("http") ? "noopener noreferrer" : undefined}
                        className={`
                            absolute inset-0 transition-opacity duration-400
                            ${i === current ? "opacity-100 z-10" : "opacity-0 z-0"}
                        `}
                        tabIndex={i === current ? 0 : -1}
                    >
                        {/* Image */}
                        <Image
                            src={slide.image}
                            alt={slide.title}
                            fill
                            className="object-cover"
                            priority={i === 0}
                        />

                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                        {/* Text */}
                        <div className="absolute bottom-0 left-0 right-0 p-5">
                            <h2 className="font-sans text-2xl sm:text-3xl font-medium leading-tight tracking-tight text-white text-balance">
                                {slide.title}
                            </h2>
                            <p className="mt-2 text-sm sm:text-base leading-relaxed text-white/80">
                                {slide.description}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Prev / Next buttons */}
            <button
                onClick={(e) => { e.preventDefault(); prev() }}
                aria-label="Previous slide"
                className="absolute left-3 top-1/2 -translate-y-1/2 z-20 h-8 w-8 flex items-center justify-center rounded-full bg-black/30 text-white opacity-0 group-hover:opacity-100 hover:bg-black/50 transition-all"
            >
                <ChevronLeft className="h-5 w-5" />
            </button>
            <button
                onClick={(e) => { e.preventDefault(); next() }}
                aria-label="Next slide"
                className="absolute right-3 top-1/2 -translate-y-1/2 z-20 h-8 w-8 flex items-center justify-center rounded-full bg-black/30 text-white opacity-0 group-hover:opacity-100 hover:bg-black/50 transition-all"
            >
                <ChevronRight className="h-5 w-5" />
            </button>

            {/* Dot indicators */}
            <div className="absolute bottom-3 right-4 z-20 flex gap-1.5">
                {slides.map((_, i) => (
                    <button
                        key={i}
                        onClick={(e) => { e.preventDefault(); goTo(i) }}
                        aria-label={`Go to slide ${i + 1}`}
                        className={`
                            h-1.5 rounded-full transition-all duration-300
                            ${i === current ? "w-5 bg-white" : "w-1.5 bg-white/50 hover:bg-white/75"}
                        `}
                    />
                ))}
            </div>
        </div>
    )
}