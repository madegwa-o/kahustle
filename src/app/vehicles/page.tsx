"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const vehicleCategories = [
    { name: "Cars", href: "/vehicles/cars", description: "Buy and sell cars", count: 1250 },
    { name: "Motorbikes & Scooters", href: "/vehicles/motorbikes", description: "Two-wheelers for sale", count: 430 },
    { name: "Trucks, Vans & Buses", href: "/vehicles/trucks", description: "Commercial vehicles", count: 180 },
    { name: "Auto Parts & Accessories", href: "/vehicles/accessories", description: "Car parts and accessories", count: 890 },
    { name: "Bicycles & 3 Wheelers", href: "/vehicles/bicycles", description: "Non-motorized transport", count: 220 },
]

export default function VehiclesPage() {
    return (
        <main className="max-w-7xl mx-auto px-4 py-12">
            <div className="mb-12">
                <h1 className="text-4xl font-bold text-foreground mb-2">Vehicles</h1>
                <p className="text-lg text-muted-foreground">
                    Browse and list vehicles in Kenya's leading marketplace
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {vehicleCategories.map((category) => (
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
