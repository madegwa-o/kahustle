"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import VehicleCard from "@/components/vehicles/vehicle-card"
import type { SearchFilters } from "@/components/search-filters"
import type { VehicleListing } from "@/lib/vehicles/types"

interface VehiclesCategoryFeedProps {
    filters: SearchFilters
    onLoadingChange: (loading: boolean) => void
}

export default function VehiclesCategoryFeed({ filters, onLoadingChange }: VehiclesCategoryFeedProps) {
    const [vehicles, setVehicles] = useState<VehicleListing[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fetchVehicles = async () => {
            setLoading(true)
            onLoadingChange(true)
            try {
                const response = await fetch("/api/vehicles?limit=8")
                if (response.ok) {
                    const data = await response.json()
                    setVehicles(data.vehicles || [])
                }
            } catch (error) {
                console.error("Error fetching vehicles:", error)
            } finally {
                setLoading(false)
                onLoadingChange(false)
            }
        }

        fetchVehicles()
    }, [onLoadingChange])

    return (
        <section className="space-y-6">
            {/* Section Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-2xl lg:text-3xl font-bold text-foreground">Vehicles</h2>
                <Link href="/vehicles" className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors">
                    <span className="font-medium">Show all</span>
                    <ChevronRight className="h-5 w-5" />
                </Link>
            </div>

            {/* Horizontal Scroll Cards */}
            <div className="overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
                <div className="flex gap-4 min-w-min">
                    {vehicles.map((vehicle) => (
                        <div key={vehicle.id} className="flex-shrink-0 w-60">
                            <VehicleCard vehicle={vehicle} />
                        </div>
                    ))}

                    {/* See All Card */}
                    <Link
                        href="/vehicles"
                        className="flex-shrink-0 w-60 h-72 rounded-lg border border-gray-200 bg-gray-50 flex flex-col items-center justify-center hover:bg-gray-100 transition-colors"
                    >
                        <div className="text-center">
                            <div className="text-4xl font-bold text-gray-400 mb-2">→</div>
                            <p className="text-lg font-semibold text-gray-700">See all</p>
                            <p className="text-sm text-gray-500 mt-1">Vehicles</p>
                        </div>
                    </Link>
                </div>
            </div>
        </section>
    )
}
