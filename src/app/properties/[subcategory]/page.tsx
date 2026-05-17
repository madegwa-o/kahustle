"use client"
import { useMemo, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import PropertyFilters from "@/components/properties/property-filters"
import PropertiesGrid from "@/components/properties/properties-grid"
import { useProperties } from "@/hooks/properties/use-properties"
import { Button } from "@/components/ui/button"

export default function PropertySubcategoryPage() {
    const { subcategory } = useParams<{ subcategory: string }>()
    const [params, setParams] = useState(
        new URLSearchParams({ page: "1", limit: "20", sort: "newest", subcategory })
    )
    const query = useMemo(() => params.toString(), [params])
    const { properties, pagination, loading, error } = useProperties(query)

    const onChange = (key: string, value: string) => {
        const next = new URLSearchParams(params)
        if (!value) next.delete(key)
        else next.set(key, value)
        if (key !== "page") next.set("page", "1")
        setParams(next)
    }

    const displayName = subcategory.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase())

    return (
        <main className="mx-auto max-w-7xl px-4 py-8">
            <Link href="/properties" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-4">
                <ChevronLeft className="h-4 w-4" />All properties
            </Link>

            <div className="mb-6">
                <h1 className="text-3xl font-bold text-foreground">{displayName}</h1>
                <p className="text-muted-foreground mt-1">Browse {displayName.toLowerCase()} available in Kenya</p>
            </div>

            <PropertyFilters values={params} onChange={onChange} />

            {loading ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="h-72 rounded-xl bg-muted animate-pulse" />
                    ))}
                </div>
            ) : error ? (
                <div className="py-16 text-center text-muted-foreground">Failed to load properties.</div>
            ) : properties.length === 0 ? (
                <div className="py-16 text-center">
                    <p className="text-muted-foreground mb-4">No {displayName.toLowerCase()} found.</p>
                    <Button variant="outline" asChild><Link href="/properties">Browse all properties</Link></Button>
                </div>
            ) : (
                <PropertiesGrid properties={properties} />
            )}

            {pagination && pagination.pages > 1 && (
                <div className="mt-8 flex items-center justify-between">
                    <Button variant="outline" size="sm" disabled={pagination.page <= 1}
                            onClick={() => onChange("page", String(pagination.page - 1))}>
                        <ChevronLeft className="h-4 w-4 mr-1" />Previous
                    </Button>
                    <span className="text-sm text-muted-foreground">
            Page {pagination.page} of {pagination.pages} · {pagination.total.toLocaleString()} results
          </span>
                    <Button variant="outline" size="sm" disabled={pagination.page >= pagination.pages}
                            onClick={() => onChange("page", String(pagination.page + 1))}>
                        Next<ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                </div>
            )}
        </main>
    )
}