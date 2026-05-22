"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import CareerCard from "@/components/careers/career-card"
import type { SearchFilters } from "@/components/search-filters"

interface CareersCategoryFeedProps {
    filters: SearchFilters
    onLoadingChange: (loading: boolean) => void
}

export default function CareersCategoryFeed({ filters, onLoadingChange }: CareersCategoryFeedProps) {
    const [careers, setCareers] = useState<any[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fetchCareers = async () => {
            setLoading(true)
            onLoadingChange(true)
            try {
                const response = await fetch("/api/careers?limit=8")
                if (response.ok) {
                    const data = await response.json()
                    setCareers(data.careers || [])
                }
            } catch (error) {
                console.error("Error fetching careers:", error)
            } finally {
                setLoading(false)
                onLoadingChange(false)
            }
        }

        fetchCareers()
    }, [onLoadingChange])

    return (
        <section className="space-y-6">
            {/* Section Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-2xl lg:text-3xl font-bold text-foreground">Jobs</h2>
                <Link href="/careers" className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors">
                    <span className="font-medium">Show all</span>
                    <ChevronRight className="h-5 w-5" />
                </Link>
            </div>

            {/* Horizontal Scroll Cards */}
            <div className="overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
                <div className="flex gap-4 min-w-min">
                    {careers.map((career) => (
                        <div key={career.id} className="flex-shrink-0 w-60">
                            <CareerCard item={career} />
                        </div>
                    ))}

                    {/* See All Card */}
                    <Link
                        href="/careers"
                        className="flex-shrink-0 w-60 rounded-lg border border-gray-200 bg-gray-50 flex flex-col items-center justify-center hover:bg-gray-100 transition-colors p-4"
                    >
                        <div className="text-center">
                            <div className="text-4xl font-bold text-gray-400 mb-2">→</div>
                            <p className="text-lg font-semibold text-gray-700">See all</p>
                            <p className="text-sm text-gray-500 mt-1">Jobs</p>
                        </div>
                    </Link>
                </div>
            </div>
        </section>
    )
}
