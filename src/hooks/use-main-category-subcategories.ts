"use client"

import useSWR from "swr"
import { MainCategory } from "@/lib/categories"

export interface ListingSubcategory {
    label: string
    slug: string
}

interface CategoriesResponse {
    categories?: {
        mainCategory: MainCategory
        subcategories: ListingSubcategory[]
    }[]
}

const fetcher = async (url: string) => {
    const res = await fetch(url)
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || "Failed to fetch categories")
    return data as CategoriesResponse
}

function toDbSlug(mainCategory: MainCategory): string {
    switch (mainCategory) {
        case MainCategory.VEHICLES:                return "vehicles"
        case MainCategory.CONSTRUCTION_FREELANCERS: return "construction-freelancers"
        case MainCategory.CAREERS:                 return "careers"
        case MainCategory.PROPERTIES:              return "properties"
    }
}

export function useMainCategorySubcategories(mainCategory: MainCategory) {
    const { data, error, isLoading } = useSWR<CategoriesResponse>("/api/categories", fetcher, {
        revalidateOnFocus: false,
        revalidateOnReconnect: true,
        dedupingInterval: 60 * 60 * 1000,
    })

    const dbSlug = toDbSlug(mainCategory)
    const subcategories =
        data?.categories?.find((category) => category.mainCategory === dbSlug)
            ?.subcategories ?? []

    return { subcategories, isLoading, error }
}