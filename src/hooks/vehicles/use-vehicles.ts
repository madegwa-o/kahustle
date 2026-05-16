// hooks/use-vehicles.ts
"use client"
import useSWR from "swr"
import { VehicleListing } from "@/lib/vehicles/normalize-vehicle"

type Pagination = {
    page: number
    limit: number
    total: number
    pages: number
}

type Response = {
    data: VehicleListing[]
    pagination: Pagination
}
const fetcher = async (url: string) => {
    const res = await fetch(url)
    const json = await res.json()

    if (!json.success) {
        throw new Error(json.error)
    }

    return json
}

export function useVehicles(queryString: string) {
    const { data, error, isLoading, mutate } = useSWR<Response>(
        `/api/vehicles?${queryString}`,
        fetcher,
        {
            keepPreviousData: true,
        }
    )

    return {
        vehicles: data?.data ?? [],
        pagination: data?.pagination ?? null,
        loading: isLoading,
        error,
        mutate,
    }
}