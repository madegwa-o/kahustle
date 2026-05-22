"use client"

import { useState, useEffect } from "react"
import { SearchFiltersComponent, type SearchFilters } from "@/components/search-filters"
// import MasonryFeeds from "@/components/masonry-feeds"
import { useCategories } from "@/hooks/use-categories"
import VehiclesCategoryFeed from "@/components/category-feeds/vehicles-feed"
import PropertiesCategoryFeed from "@/components/category-feeds/properties-feed"
import CareersCategoryFeed from "@/components/category-feeds/careers-feed"
import ServicesCategoryFeed from "@/components/category-feeds/services-feed"

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
            <main className="max-w-7xl mx-auto px-4 py-8 lg:py-12">
                {/* Search Bar */}
                <div className="mb-16">
                    <SearchFiltersComponent categories={categories} onFiltersChange={handleFiltersChange} isLoading={isLoading} />
                </div>

                {/* Category Sections */}
                <div className="space-y-16">
                    {/* Vehicles Section */}
                    <VehiclesCategoryFeed filters={filters} onLoadingChange={setIsLoading} />

                    {/* Properties Section */}
                    <PropertiesCategoryFeed filters={filters} onLoadingChange={setIsLoading} />

                    {/* Careers Section */}
                    <CareersCategoryFeed filters={filters} onLoadingChange={setIsLoading} />

                    {/* Services Section */}
                    <ServicesCategoryFeed filters={filters} onLoadingChange={setIsLoading} />
                </div>

                {/* Commented out masonry for future use */}
                {/* <MasonryFeeds filters={filters} onLoadingChange={setIsLoading} /> */}
            </main>
        </div>
    )
}
