"use client"

import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const careerCategories = [
    { name: "Employers", href: "/careers/employers", description: "Post job opportunities", count: 85 },
    { name: "Local Jobs", href: "/careers/local-jobs", description: "Job listings for jobseekers", count: 420 },
    { name: "Jobseekers", href: "/careers/jobseekers", description: "Career opportunities", count: 180 },
]

export default function CareersPage() {
    return (
        <main className="max-w-7xl mx-auto px-4 py-12">
            <div className="mb-12">
                <h1 className="text-4xl font-bold text-foreground mb-2">Careers</h1>
                <p className="text-lg text-muted-foreground">
                    Find your next career opportunity in Kenya
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {careerCategories.map((category) => (
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
