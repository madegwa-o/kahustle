"use client"

import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { useCategoryPage } from "@/hooks/use-category-page"

interface CategoryPageProps {
    slug: string                  // e.g. "vehicles"
    title: string                 // e.g. "Vehicles"
    description: string           // page subtitle
}

export default function CategoryPage({ slug, title, description }: CategoryPageProps) {
    const { subcategories, isLoading, error } = useCategoryPage(slug)

    return (
        <main className="max-w-7xl mx-auto px-4 py-12">
            <div className="mb-12">
                <h1 className="text-4xl font-bold text-foreground mb-2">{title}</h1>
                <p className="text-lg text-muted-foreground">{description}</p>
            </div>

            {isLoading && (
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading categories...
                </div>
            )}

            {error && (
                <p className="text-sm text-destructive">
                    Failed to load subcategories. Please refresh the page.
                </p>
            )}

            {!isLoading && !error && subcategories.length === 0 && (
                <p className="text-sm text-muted-foreground">No subcategories found.</p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {subcategories.map((sub) => (
                    <Link key={sub.slug} href={`/${slug}/${sub.slug}`}>
                        <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h2 className="text-xl font-semibold text-foreground">
                                            {sub.label}
                                        </h2>
                                    </div>
                                    <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </main>
    )
}