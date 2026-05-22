"use client"

import { useState, useEffect } from "react"
import { SearchFiltersComponent, type SearchFilters } from "@/components/search-filters"
import MasonryFeeds from "@/components/masonry-feeds"
import { useCategories } from "@/hooks/use-categories"

export default function Home() {
    const { categories, fetchCategories } = useCategories()
    const [filters, setFilters] = useState<SearchFilters>({
        search: "",
        categories: [],
        priceMin: null,
        priceMax: null,
        sortBy: "createdAt",
        sortOrder: "desc",
    })
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        fetchCategories()
    }, [fetchCategories])

    const handleFiltersChange = (newFilters: SearchFilters) => {
        setFilters(newFilters)
    }

    return (
        <div className="min-h-screen bg-background">
            <main className="max-w-7xl mx-auto px-4 py-16 lg:py-24">

                <a
                    href="https://chat.whatsapp.com/?mode=wwt"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block mb-16 lg:mb-24 max-w-3xl transition-transform hover:opacity-90"
                >
                    <div>
                        <h1 className="text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-foreground text-balance">
                            Your Hustle Marketplace
                        </h1>
                        <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-2xl">
                            Buy, sell and rent cars and properties, find a job or be a freelancer. Safe, convenient, and built for the common mwananchi.
                        </p>
                    </div>
                </a>

                <div className="mb-16 lg:mb-24">
                    <SearchFiltersComponent categories={categories} onFiltersChange={handleFiltersChange} isLoading={isLoading} />
                </div>

                <MasonryFeeds filters={filters} onLoadingChange={setIsLoading} />
            </main>

        </div>
    )
}
