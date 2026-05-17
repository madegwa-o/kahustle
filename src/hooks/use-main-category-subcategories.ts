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

export function useMainCategorySubcategories(mainCategory: MainCategory) {
  const { data, error, isLoading } = useSWR<CategoriesResponse>("/api/categories", fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    dedupingInterval: 60 * 60 * 1000,
  })

  const subcategories = data?.categories?.find((category) => category.mainCategory === mainCategory)?.subcategories ?? []

  return {
    subcategories,
    isLoading,
    error,
  }
}
