import { FilterQuery } from "mongoose"
import { IProperty } from "@/models/Property"

const toNumber = (v: string | null, fallback: number) => {
  const n = Number(v)
  return Number.isFinite(n) ? n : fallback
}

const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

export function normalizePropertyPagination(searchParams: URLSearchParams) {
  const page = Math.max(1, toNumber(searchParams.get("page"), 1))
  const limit = Math.min(50, Math.max(1, toNumber(searchParams.get("limit"), 20)))
  return { page, limit, skip: (page - 1) * limit }
}

export function propertySortToMongo(sort: string | null): Record<string, 1 | -1> {
  switch (sort || "newest") {
    case "oldest": return { createdAt: 1 }
    case "lowest-price": return { price: 1 }
    case "highest-price": return { price: -1 }
    case "most-bedrooms": return { bedrooms: -1, createdAt: -1 }
    case "largest": return { squareFeet: -1, createdAt: -1 }
    default: return { createdAt: -1 }
  }
}

export function buildPropertyQuery(searchParams: URLSearchParams): FilterQuery<IProperty> {
  const filter: FilterQuery<IProperty> = { status: "active" }

  const city = searchParams.get("city")
  if (city) filter.city = new RegExp(escapeRegex(city), "i") as never

  const condition = searchParams.get("condition")
  if (condition) filter.condition = condition as never

  const propertyType = searchParams.get("propertyType")
  if (propertyType) filter.propertyType = new RegExp(escapeRegex(propertyType), "i") as never

  const subcategory = searchParams.get("subcategory")
  if (subcategory) filter.propertyType = new RegExp(escapeRegex(subcategory), "i") as never

  const minBedrooms = searchParams.get("minBedrooms")
  if (minBedrooms) filter.bedrooms = { $gte: Number(minBedrooms) } as never

  const minBathrooms = searchParams.get("minBathrooms")
  if (minBathrooms) filter.bathrooms = { $gte: Number(minBathrooms) } as never

  const minPrice = searchParams.get("minPrice")
  const maxPrice = searchParams.get("maxPrice")
  if (minPrice || maxPrice) filter.price = {
    ...(minPrice ? { $gte: Number(minPrice) } : {}),
    ...(maxPrice ? { $lte: Number(maxPrice) } : {}),
  }

  const search = searchParams.get("search")
  if (search) {
    const safeRegex = new RegExp(escapeRegex(search), "i")
    filter.$or = [{ name: safeRegex }, { description: safeRegex }, { city: safeRegex }, { address: safeRegex }]
  }

  return filter
}
