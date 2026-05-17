"use client"
import { useMemo, useState } from "react"
import { useProperties } from "@/hooks/properties/use-properties"
import PropertyFilters from "@/components/properties/property-filters"
import PropertiesGrid from "@/components/properties/properties-grid"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { CreatePropertyForm } from "@/components/forms/create-property-form"
import { canCreateProperty } from "@/lib/properties/property-permissions"
import { useSession } from "next-auth/react"

export default function PropertiesPage() {
    const [params, setParams] = useState(new URLSearchParams({ page: "1", limit: "20", sort: "newest" }))
    const query = useMemo(() => params.toString(), [params])
    const { properties, pagination, loading, error, mutate } = useProperties(query)
    const [openCreate, setOpenCreate] = useState(false)
    const [isCreating, setIsCreating] = useState(false)

    const { data: session } = useSession()
    const canPost = canCreateProperty(session?.user)

    const onChange = (key: string, value: string) => {
        const next = new URLSearchParams(params)
        if (!value) next.delete(key)
        else next.set(key, value)
        if (key !== "page") next.set("page", "1")
        setParams(next)
    }

    const handleCreate = async (data: unknown) => {
        setIsCreating(true)
        try {
            const res = await fetch("/api/properties", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            })
            if (!res.ok) throw new Error("Failed to create listing")
            setOpenCreate(false)
            await mutate()
        } finally {
            setIsCreating(false)
        }
    }

    return (
        <main className="mx-auto max-w-7xl px-4 py-8">
            <div className="flex items-center justify-between gap-3">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-foreground">Properties</h1>
                    <p className="text-muted-foreground mt-1">Browse properties for sale and rent across Kenya</p>
                </div>
                {canPost ? (
                    <Button onClick={() => setOpenCreate(true)}>Post Property</Button>
                ) : (
                    <Button asChild variant="outline"><a href="/account">Become a Property Seller to Post</a></Button>
                )}
            </div>

            <PropertyFilters values={params} onChange={onChange} />

            {loading ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="h-72 rounded-xl bg-muted animate-pulse" />
                    ))}
                </div>
            ) : error ? (
                <div className="py-16 text-center text-muted-foreground">Failed to load properties. Please try again.</div>
            ) : properties.length === 0 ? (
                <div className="py-16 text-center text-muted-foreground">No properties found matching your filters.</div>
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
            Page {pagination.page} of {pagination.pages} · {pagination.total.toLocaleString()} properties
          </span>
                    <Button variant="outline" size="sm" disabled={pagination.page >= pagination.pages}
                            onClick={() => onChange("page", String(pagination.page + 1))}>
                        Next<ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                </div>
            )}

            {canPost && (
                <CreatePropertyForm
                    open={openCreate}
                    onOpenChange={setOpenCreate}
                    onSubmit={handleCreate}
                    isLoading={isCreating}
                />
            )}
        </main>
    )
}