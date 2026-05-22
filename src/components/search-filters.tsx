"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { Category } from "@/hooks/use-categories"

export interface SearchFilters {
    search: string
    categories: string[]
    priceMin: number | null
    priceMax: number | null
    sortBy: "createdAt" | "price" | "name"
    sortOrder: "asc" | "desc"
}

interface SearchFiltersProps {
    categories: Category[]
    onFiltersChange: (filters: SearchFilters) => void
    isLoading?: boolean
}

export function SearchFiltersComponent({ onFiltersChange, isLoading = false }: SearchFiltersProps) {
    const [search, setSearch] = useState("")

    const handleSearch = () => {
        onFiltersChange({
            search: search.trim(),
            categories: [],
            priceMin: null,
            priceMax: null,
            sortBy: "createdAt",
            sortOrder: "desc",
        })
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleSearch()
        }
    }

    return (
        <div className="w-full mb-12">
            {/* Airbnb-style search bar */}
            <div className="flex items-center bg-white rounded-full shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                <Search className="h-5 w-5 text-gray-400 ml-4" />
                <Input
                    placeholder="Start your search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={isLoading}
                    className="flex-1 border-0 bg-transparent placeholder-gray-500 text-gray-900 focus:outline-none focus-visible:ring-0"
                />
                <Button
                    onClick={handleSearch}
                    disabled={isLoading}
                    className="rounded-full bg-primary hover:bg-primary/90 text-white mr-1 h-10 w-10 p-0"
                >
                    <Search className="h-5 w-5" />
                </Button>
            </div>
        </div>
    )
}
