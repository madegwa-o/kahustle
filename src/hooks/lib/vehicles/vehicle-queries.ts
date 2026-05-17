// lib/vehicles/vehicle-queries.ts
import { FilterQuery } from "mongoose"
import { IVehicle } from "@/models/Vehicle"
import { VehicleSort } from "./vehicle-filters"

const toNumber = (v: string | null, fallback: number) => {
  const n = Number(v)
  return Number.isFinite(n) ? n : fallback
}

const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

export function normalizeVehiclePagination(searchParams: URLSearchParams) {
  const page = Math.max(1, toNumber(searchParams.get("page"), 1))
  const limit = Math.min(50, Math.max(1, toNumber(searchParams.get("limit"), 20)))
  return { page, limit, skip: (page - 1) * limit }
}

export function vehicleSortToMongo(sort: string | null): Record<string, 1 | -1> {
  const selected = (sort || "newest") as VehicleSort
  switch (selected) {
    case "oldest":          return { createdAt: 1 }
    case "lowest-price":    return { price: 1 }
    case "highest-price":   return { price: -1 }
    case "lowest-mileage":  return { mileage: 1 }
    case "highest-mileage": return { mileage: -1 }
    case "newest-year":     return { year: -1, createdAt: -1 }
    default:                return { createdAt: -1 }
  }
}

export function buildVehicleQuery(searchParams: URLSearchParams): FilterQuery<IVehicle> {
  const filter: FilterQuery<IVehicle> = { status: "active" }

  const exactFields = ["make", "vehicleModel", "condition", "fuelType", "transmission", "bodyType", "location"]
  exactFields.forEach((field) => {
    const value = searchParams.get(field)
    if (value) filter[field as keyof IVehicle] = new RegExp(escapeRegex(value), "i") as never
  })

  // subcategory maps to bodyType
  const subcategory = searchParams.get("subcategory")
  if (subcategory) filter.bodyType = new RegExp(escapeRegex(subcategory), "i") as never

  const year = searchParams.get("year")
  if (year && Number.isFinite(Number(year))) filter.year = Number(year)

  const minMileage = searchParams.get("minMileage")
  const maxMileage = searchParams.get("maxMileage")
  if (minMileage || maxMileage) filter.mileage = {
    ...(minMileage ? { $gte: Number(minMileage) } : {}),
    ...(maxMileage ? { $lte: Number(maxMileage) } : {}),
  }

  const minPrice = searchParams.get("minPrice")
  const maxPrice = searchParams.get("maxPrice")
  if (minPrice || maxPrice) filter.price = {
    ...(minPrice ? { $gte: Number(minPrice) } : {}),
    ...(maxPrice ? { $lte: Number(maxPrice) } : {}),
  }

  const search = searchParams.get("search")
  if (search) {
    const safeRegex = new RegExp(escapeRegex(search), "i")
    filter.$or = [{ name: safeRegex }, { make: safeRegex }, { vehicleModel: safeRegex }, { description: safeRegex }]
  }

  return filter
}