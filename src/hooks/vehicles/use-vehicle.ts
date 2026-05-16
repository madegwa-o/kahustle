// hooks/use-vehicle.ts
"use client"
import useSWR from "swr"
import { VehicleDetail } from "@/lib/vehicles/normalize-vehicle"

const fetcher = (url: string) => fetch(url).then(r => r.json()).then(r => {
    if (!r.success) throw new Error(r.error)
    return r.data
})

export function useVehicle(id: string) {
    const { data, error, isLoading } = useSWR<VehicleDetail>(
        `/api/vehicles/${id}`,
        fetcher
    )
    return { vehicle: data ?? null, loading: isLoading, error }
}