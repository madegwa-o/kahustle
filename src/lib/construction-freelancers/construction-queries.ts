import { FilterQuery } from "mongoose"
import { IConstructionService } from "@/models/ConstructionService"

const toNumber = (v: string | null, fallback: number) => {
  const n = Number(v)
  return Number.isFinite(n) ? n : fallback
}

const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

export function normalizeConstructionPagination(searchParams: URLSearchParams) {
  const page = Math.max(1, toNumber(searchParams.get("page"), 1))
  const limit = Math.min(50, Math.max(1, toNumber(searchParams.get("limit"), 20)))
  return { page, limit, skip: (page - 1) * limit }
}

export function constructionSortToMongo(sort: string | null): Record<string, 1 | -1> {
  switch (sort || "newest") {
    case "oldest": return { createdAt: 1 }
    case "lowest-price": return { price: 1 }
    case "highest-price": return { price: -1 }
    case "most-experience": return { yearsOfExperience: -1, createdAt: -1 }
    case "most-projects": return { previousProjects: -1, createdAt: -1 }
    default: return { createdAt: -1 }
  }
}

export function buildConstructionQuery(searchParams: URLSearchParams): FilterQuery<IConstructionService> {
  const filter: FilterQuery<IConstructionService> = { status: "active" }
  const andClauses: FilterQuery<IConstructionService>[] = []

  const serviceArea = searchParams.get("serviceArea")
  if (serviceArea) filter.serviceArea = { $in: [new RegExp(escapeRegex(serviceArea), "i")] } as never

  const category = searchParams.get("category")
  if (category) filter.category = new RegExp(escapeRegex(category), "i") as never

  const subcategory = searchParams.get("subcategory")
  if (subcategory) {
    const safeRegex = new RegExp(escapeRegex(subcategory), "i")
    andClauses.push({ $or: [{ subcategory: safeRegex }, { category: safeRegex }] } as FilterQuery<IConstructionService>)
  }

  const availability = searchParams.get("availability")
  if (availability) filter.availability = availability as never

  const minExperience = searchParams.get("minExperience")
  if (minExperience) filter.yearsOfExperience = { $gte: Number(minExperience) } as never

  const minPrice = searchParams.get("minPrice")
  const maxPrice = searchParams.get("maxPrice")
  if (minPrice || maxPrice) filter.price = {
    ...(minPrice ? { $gte: Number(minPrice) } : {}),
    ...(maxPrice ? { $lte: Number(maxPrice) } : {}),
  }

  const search = searchParams.get("search")
  if (search) {
    const safeRegex = new RegExp(escapeRegex(search), "i")
    andClauses.push({ $or: [{ name: safeRegex }, { description: safeRegex }, { category: safeRegex }, { expertise: safeRegex }] } as FilterQuery<IConstructionService>)
  }

  if (andClauses.length) filter.$and = andClauses

  return filter
}