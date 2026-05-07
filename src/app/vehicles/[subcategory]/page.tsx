"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import MasonryFeeds from "@/components/masonry-feeds"
import type { SearchFilters } from "@/components/search-filters"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"

const subcategoryMap: Record<string, { name: string; displayName: string }> = {
    cars: { name: "cars", displayName: "Cars" },
    motorbikes: { name: "motorbikes & scooters", displayName: "Motorbikes & Scooters" },
    trucks: { name: "trucks, vans & buses", displayName: "Trucks, Vans & Buses" },
    accessories: { name: "auto parts & accessories", displayName: "Auto Parts & Accessories" },
    bicycles: { name: "bicycles & 3 wheelers", displayName: "Bicycles & 3 Wheelers" },
}

export default function VehicleSubcategoryPage() {
    const params = useParams()
    const subcategory = params.subcategory as string
    const categoryInfo = subcategoryMap[subcategory] || { name: subcategory, displayName: subcategory }

    const [filters, setFilters] = useState<SearchFilters>({
        categories: [categoryInfo.name],
        search: "",
        priceMin: null,
        priceMax: null,
        sortBy: "createdAt",
        sortOrder: "desc",
    })

    const [priceMin, setPriceMin] = useState<string>("")
    const [priceMax, setPriceMax] = useState<string>("")
    const [isLoading, setIsLoading] = useState(false)

    const handleApplyPriceFilter = () => {
        const min = priceMin ? parseFloat(priceMin) : null
        const max = priceMax ? parseFloat(priceMax) : null
        setFilters((prev) => ({
            ...prev,
            priceMin: min,
            priceMax: max,
        }))
    }

    const handleResetFilters = () => {
        setPriceMin("")
        setPriceMax("")
        setFilters({
            categories: [categoryInfo.name],
            search: "",
            priceMin: null,
            priceMax: null,
            sortBy: "createdAt",
            sortOrder: "desc",
        })
    }

    return (
        <main className="max-w-7xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8">
                <Link href="/vehicles" className="flex items-center gap-2 text-primary hover:underline mb-4">
                    <ChevronLeft className="h-4 w-4" />
                    Back to Vehicles
                </Link>
                <h1 className="text-4xl font-bold text-foreground mb-2">
                    {categoryInfo.displayName}
                </h1>
                <p className="text-muted-foreground">
                    Browse all {categoryInfo.displayName.toLowerCase()} available in Kenya
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Sidebar Filters */}
                <div className="lg:col-span-1">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Filters</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Price Range */}
                            <div>
                                <Label className="mb-3 block">Price Range (KES)</Label>
                                <div className="space-y-3">
                                    <Input
                                        type="number"
                                        placeholder="Min price"
                                        value={priceMin}
                                        onChange={(e) => setPriceMin(e.target.value)}
                                    />
                                    <Input
                                        type="number"
                                        placeholder="Max price"
                                        value={priceMax}
                                        onChange={(e) => setPriceMax(e.target.value)}
                                    />
                                    <Button
                                        onClick={handleApplyPriceFilter}
                                        className="w-full"
                                        size="sm"
                                    >
                                        Apply Filter
                                    </Button>
                                </div>
                            </div>

                            {/* Reset Button */}
                            <Button
                                variant="outline"
                                onClick={handleResetFilters}
                                className="w-full"
                            >
                                Reset Filters
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Products Grid */}
                <div className="lg:col-span-3">
                    {isLoading && (
                        <div className="flex items-center justify-center py-12">
                            <p className="text-muted-foreground">Loading products...</p>
                        </div>
                    )}
                    <MasonryFeeds
                        filters={filters}
                        onLoadingChange={setIsLoading}
                    />
                </div>
            </div>
        </main>
    )
}
