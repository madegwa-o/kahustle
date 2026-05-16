// hooks/use-vehicles.ts
"use client"
import useSWR from "swr"
import { VehicleListing } from "@/lib/vehicles/normalize-vehicle"

type Pagination = { page: number; limit: number; total: number; pages: number }
type Response = { data: VehicleListing[]; pagination: Pagination }

const fetcher = (url: string) => fetch(url).then(r => r.json()).then(r => {
    if (!r.success) throw new Error(r.error)
    return r
})

export function useVehicles(queryString: string) {
    const { data, error, isLoading } = useSWR<Response>(
        `/api/vehicles?${queryString}`,
        fetcher,
        { keepPreviousData: true } // prevents flash when filters change
    )
    return {
        vehicles: data?.data ?? [],
        pagination: data?.pagination ?? null,
        loading: isLoading,
        error,
    }
}