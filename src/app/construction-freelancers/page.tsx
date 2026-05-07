"use client"

import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const constructionCategories = [
    { name: "Plumber", href: "/construction-freelancers/plumber", description: "Plumbing services", count: 125 },
    { name: "Building Construction", href: "/construction-freelancers/building-construction", description: "General construction", count: 340 },
    { name: "Electrician", href: "/construction-freelancers/electrician", description: "Electrical services", count: 210 },
    { name: "Masonry", href: "/construction-freelancers/masonry", description: "Masonry and brickwork", count: 180 },
    { name: "Carpentry", href: "/construction-freelancers/carpentry", description: "Woodwork and carpentry", count: 155 },
]

export default function ConstructionFreelancersPage() {
    return (
        <main className="max-w-7xl mx-auto px-4 py-12">
            <div className="mb-12">
                <h1 className="text-4xl font-bold text-foreground mb-2">Construction Freelancers</h1>
                <p className="text-lg text-muted-foreground">
                    Find skilled construction professionals in Kenya
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {constructionCategories.map((category) => (
                    <Link key={category.href} href={category.href}>
                        <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <h2 className="text-xl font-semibold text-foreground">
                                            {category.name}
                                        </h2>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            {category.description}
                                        </p>
                                    </div>
                                    <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                                </div>
                                <p className="text-sm text-primary font-medium">
                                    {category.count} listings
                                </p>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </main>
    )
}
