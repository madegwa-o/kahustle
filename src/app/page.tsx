"use client"

import { useState, useEffect } from "react"
import { SearchFiltersComponent, type SearchFilters } from "@/components/search-filters"
import MasonryFeeds from "@/components/masonry-feeds"
import { useCategories } from "@/hooks/use-categories"
import { RightPanel } from "@/components/right-panel"
import Footer from "@/components/footer"
import HeroCarousel from "@/components/HeroCarousel";

export default function Home() {
    const { categories, fetchCategories } = useCategories()
    const [isPanelOpen, setIsPanelOpen] = useState(false)
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
        <div className="flex min-h-screen bg-card">
            <main className="flex-1 p-6 overflow-y-auto">
                <HeroCarousel />

            {/* Example button to open the panel on mobile */}
            <button
                onClick={() => setIsPanelOpen(true)}
                className="mb-4 text-sm text-primary underline md:hidden"
            >
                Open filters panel
            </button>

            <SearchFiltersComponent
                categories={categories}
                onFiltersChange={handleFiltersChange}
                isLoading={isLoading}
            />
            <MasonryFeeds filters={filters} onLoadingChange={setIsLoading} />
            <Footer />
        </main>

    <RightPanel
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        title="Panel"
    >
        <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Thank you for shoping with us.</p>
        </div>
    </RightPanel>
</div>
)
}