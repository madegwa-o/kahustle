import useSWR from "swr"

interface Subcategory {
    label: string
    slug: string
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function useCategoryPage(categorySlug: string) {
    const { data, error, isLoading } = useSWR<{ categories: { mainCategory: string; subcategories: Subcategory[] }[] }>(
        "/api/categories",
        fetcher,
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
            dedupingInterval: 60 * 60 * 1000,
        }
    )

    const subcategories = data?.categories
        ?.find((c) => c.mainCategory === categorySlug)
        ?.subcategories ?? []

    return { subcategories, isLoading, error }
}