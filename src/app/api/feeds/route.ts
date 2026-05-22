import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import { Product } from "@/models/Product"
import { Vehicle } from "@/models/Vehicle"
import { Property } from "@/models/Property"
import { Job } from "@/models/Job"
import { ConstructionService } from "@/models/ConstructionService"

type FeedItem = {
  _id: { toString(): string } | string
  name?: string
  description?: string
  price?: number
  category?: string
  subcategory?: string
  bodyType?: string
  propertyType?: string
  jobTitle?: string
  images?: unknown[]
  createdAt?: Date | string
  detailUrl?: string
  _model?: string
}

const itemId = (item: FeedItem) => typeof item._id === "string" ? item._id : item._id.toString()

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase()

    const { searchParams } = new URL(request.url)
    const page = Math.max(1, Number.parseInt(searchParams.get("page") || "1", 10))
    const limit = Math.min(50, Math.max(1, Number.parseInt(searchParams.get("limit") || "20", 10)))
    const sortBy = searchParams.get("sortBy") || "createdAt"
    const sortOrder = searchParams.get("sortOrder") === "asc" ? 1 : -1
    const search = searchParams.get("search")?.trim()
    const categories = searchParams.getAll("categories").map((c) => c.toLowerCase().trim()).filter(Boolean)
    const priceMin = searchParams.get("priceMin")
    const priceMax = searchParams.get("priceMax")
    const categoryRegexes = categories.map((category) => new RegExp(category, "i"))

    // Base filter for all models
    const baseFilter: Record<string, unknown> = { status: "active" }

    if (priceMin || priceMax) {
      baseFilter.price = {
        ...(priceMin ? { $gte: Number.parseFloat(priceMin) } : {}),
        ...(priceMax ? { $lte: Number.parseFloat(priceMax) } : {}),
      }
    }

    const sortConfig: Record<string, 1 | -1> = {
      [sortBy === "price" || sortBy === "name" || sortBy === "createdAt" ? sortBy : "createdAt"]: sortOrder,
    }

    // Fetch from all models
    const [products, vehicles, properties, jobs, constructionServices] = await Promise.all([
      search
          ? Product.find({
            ...baseFilter,
            $or: [
              { name: { $regex: search, $options: "i" } },
              { description: { $regex: search, $options: "i" } },
            ],
            ...(categories.length > 0 && { category: { $in: categories } }),
          })
              .sort(sortConfig)
              .lean()
          : categories.length > 0
              ? Product.find({ ...baseFilter, category: { $in: categories } })
                  .sort(sortConfig)
                  .lean()
              : Product.find(baseFilter).sort(sortConfig).lean(),

      search
          ? Vehicle.find({
            ...baseFilter,
            $and: [
              {
                $or: [
                  { name: { $regex: search, $options: "i" } },
                  { description: { $regex: search, $options: "i" } },
                ],
              },
              ...(categories.length > 0 ? [{ $or: [{ subcategory: { $in: categoryRegexes } }, { bodyType: { $in: categoryRegexes } }] }] : []),
            ],
          })
              .sort(sortConfig)
              .lean()
          : categories.length === 0
              ? Vehicle.find(baseFilter).sort(sortConfig).lean()
              : Vehicle.find({ ...baseFilter, $or: [{ subcategory: { $in: categoryRegexes } }, { bodyType: { $in: categoryRegexes } }] }).sort(sortConfig).lean(),

      search
          ? Property.find({
            ...baseFilter,
            $and: [
              {
                $or: [
                  { name: { $regex: search, $options: "i" } },
                  { description: { $regex: search, $options: "i" } },
                ],
              },
              ...(categories.length > 0 ? [{ $or: [{ subcategory: { $in: categoryRegexes } }, { propertyType: { $in: categoryRegexes } }] }] : []),
            ],
          })
              .sort(sortConfig)
              .lean()
          : categories.length === 0
              ? Property.find(baseFilter).sort(sortConfig).lean()
              : Property.find({ ...baseFilter, $or: [{ subcategory: { $in: categoryRegexes } }, { propertyType: { $in: categoryRegexes } }] }).sort(sortConfig).lean(),

      search
          ? Job.find({
            ...baseFilter,
            $or: [
              { name: { $regex: search, $options: "i" } },
              { description: { $regex: search, $options: "i" } },
              { jobTitle: { $regex: search, $options: "i" } },
            ],
          })
              .sort(sortConfig)
              .lean()
          : categories.length === 0
              ? Job.find(baseFilter).sort(sortConfig).lean()
              : Job.find(baseFilter).sort(sortConfig).lean(),

      search
          ? ConstructionService.find({
            ...baseFilter,
            $and: [
              {
                $or: [
                  { name: { $regex: search, $options: "i" } },
                  { description: { $regex: search, $options: "i" } },
                  { category: { $regex: search, $options: "i" } },
                ],
              },
              ...(categories.length > 0 ? [{ $or: [{ subcategory: { $in: categoryRegexes } }, { category: { $in: categoryRegexes } }] }] : []),
            ],
          })
              .sort(sortConfig)
              .lean()
          : categories.length > 0
              ? ConstructionService.find({
                ...baseFilter,
                $or: [{ subcategory: { $in: categoryRegexes } }, { category: { $in: categoryRegexes } }],
              })
                  .sort(sortConfig)
                  .lean()
              : ConstructionService.find(baseFilter).sort(sortConfig).lean(),
    ])

    // Combine and normalize results
    const allItems = [
      ...products.map((p) => ({ ...p, _model: "Product", category: p.category, detailUrl: `/product/${itemId(p as FeedItem)}` })),
      ...vehicles.map((v) => ({ ...v, _model: "Vehicle", category: v.subcategory || "vehicles", detailUrl: `/vehicles/listing/${itemId(v as FeedItem)}` })),
      ...properties.map((p) => ({ ...p, _model: "Property", category: p.subcategory || "properties", detailUrl: `/properties/listing/${itemId(p as FeedItem)}` })),
      ...jobs.map((j) => ({ ...j, _model: "Job", category: "careers", detailUrl: `/careers/listing/${itemId(j as FeedItem)}` })),
      ...constructionServices.map((cs) => ({
        ...cs,
        _model: "ConstructionService",
        category: cs.subcategory || cs.category?.toLowerCase() || "construction-service",
        detailUrl: `/construction-freelancers/listing/${itemId(cs as FeedItem)}`,
      })),
    ] as FeedItem[]

    // Apply search filtering if needed (for combined results)
    let filteredItems = allItems
    if (search) {
      const searchLower = search.toLowerCase()
      filteredItems = allItems.filter(
          (item) =>
              item.name?.toLowerCase().includes(searchLower) ||
              item.description?.toLowerCase().includes(searchLower) ||
              item.jobTitle?.toLowerCase().includes(searchLower) ||
              item.category?.toLowerCase().includes(searchLower)
      )
    }

    // Sort combined results
    const sortField = sortBy === "price" || sortBy === "name" || sortBy === "createdAt" ? sortBy : "createdAt"
    if (sortField === "createdAt") {
      filteredItems.sort((a, b) => {
        const aTime = new Date(a.createdAt ?? 0).getTime()
        const bTime = new Date(b.createdAt ?? 0).getTime()
        return sortOrder === 1 ? aTime - bTime : bTime - aTime
      })
    } else if (sortField === "price") {
      filteredItems.sort((a, b) => {
        return sortOrder === 1 ? (a.price ?? 0) - (b.price ?? 0) : (b.price ?? 0) - (a.price ?? 0)
      })
    } else if (sortField === "name") {
      filteredItems.sort((a, b) => {
        const aName = (a.name || "").toLowerCase()
        const bName = (b.name || "").toLowerCase()
        return sortOrder === 1 ? aName.localeCompare(bName) : bName.localeCompare(aName)
      })
    }

    // Paginate
    const totalCount = filteredItems.length
    const skip = (page - 1) * limit
    const paginatedItems = filteredItems.slice(skip, skip + limit)
    const totalPages = Math.max(1, Math.ceil(totalCount / limit))

    console.log("[v0] Feeds API results:", {
      totalCount,
      page,
      limit,
      products: products.length,
      vehicles: vehicles.length,
      properties: properties.length,
      jobs: jobs.length,
      constructionServices: constructionServices.length,
      paginatedItems: paginatedItems.length,
    })

    return NextResponse.json({
      products: paginatedItems,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    })
  } catch (error) {
    console.error("GET /api/feeds error:", error)
    return NextResponse.json({ error: "Failed to fetch feeds" }, { status: 500 })
  }
}