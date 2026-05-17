// lib/vehicles/vehicle-query-string.ts
export function buildVehicleQueryString(params: {
    subcategory?: string
    page?: number
    sort?: string
    search?: string
    make?: string
    year?: number
    condition?: string
    fuelType?: string
    transmission?: string
    minPrice?: number
    maxPrice?: number
    minMileage?: number
    maxMileage?: number
}) {
    const q = new URLSearchParams()
    if (params.subcategory)             q.set("subcategory", params.subcategory)
    if (params.page && params.page > 1) q.set("page", String(params.page))
    if (params.sort)                    q.set("sort", params.sort)
    if (params.search)                  q.set("search", params.search)
    if (params.make)                    q.set("make", params.make)
    if (params.year)                    q.set("year", String(params.year))
    if (params.condition)               q.set("condition", params.condition)
    if (params.fuelType)                q.set("fuelType", params.fuelType)
    if (params.transmission)            q.set("transmission", params.transmission)
    if (params.minPrice)                q.set("minPrice", String(params.minPrice))
    if (params.maxPrice)                q.set("maxPrice", String(params.maxPrice))
    if (params.minMileage)              q.set("minMileage", String(params.minMileage))
    if (params.maxMileage)              q.set("maxMileage", String(params.maxMileage))
    return q.toString()
}