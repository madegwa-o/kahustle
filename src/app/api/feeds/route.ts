import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import { Product } from "@/models/Product"
import { Vehicle } from "@/models/Vehicle"
import { Property } from "@/models/Property"
import { Job } from "@/models/Job"
import { ConstructionService } from "@/models/ConstructionService"

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
            $or: [
              { name: { $regex: search, $options: "i" } },
              { description: { $regex: search, $options: "i" } },
            ],
          })
            .sort(sortConfig)
            .lean()
        : categories.length === 0
          ? Vehicle.find(baseFilter).sort(sortConfig).lean()
          : Vehicle.find(baseFilter).sort(sortConfig).lean(), // Vehicles don't have category filter

      search
        ? Property.find({
            ...baseFilter,
            $or: [
              { name: { $regex: search, $options: "i" } },
              { description: { $regex: search, $options: "i" } },
            ],
          })
            .sort(sortConfig)
            .lean()
        : categories.length === 0
          ? Property.find(baseFilter).sort(sortConfig).lean()
          : Property.find(baseFilter).sort(sortConfig).lean(),

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
            $or: [
              { name: { $regex: search, $options: "i" } },
              { description: { $regex: search, $options: "i" } },
              { serviceType: { $regex: search, $options: "i" } },
            ],
          })
            .sort(sortConfig)
            .lean()
        : categories.length > 0
          ? ConstructionService.find({
              ...baseFilter,
              serviceType: { $in: categories },
            })
              .sort(sortConfig)
              .lean()
          : ConstructionService.find(baseFilter).sort(sortConfig).lean(),
    ])

    // Combine and normalize results
    const allItems = [
      ...products.map((p: any) => ({ ...p, _model: "Product", category: p.category })),
      ...vehicles.map((v: any) => ({ ...v, _model: "Vehicle", category: "vehicles" })),
      ...properties.map((p: any) => ({ ...p, _model: "Property", category: "properties" })),
      ...jobs.map((j: any) => ({ ...j, _model: "Job", category: "careers" })),
      ...constructionServices.map((cs: any) => ({
        ...cs,
        _model: "ConstructionService",
        category: cs.serviceType?.toLowerCase() || "construction-service",
      })),
    ]

    // Apply search filtering if needed (for combined results)
    let filteredItems = allItems
    if (search) {
      const searchLower = search.toLowerCase()
      filteredItems = allItems.filter(
        (item: any) =>
          item.name?.toLowerCase().includes(searchLower) ||
          item.description?.toLowerCase().includes(searchLower) ||
          item.jobTitle?.toLowerCase().includes(searchLower) ||
          item.serviceType?.toLowerCase().includes(searchLower)
      )
    }

    // Sort combined results
    const sortField = sortBy === "price" || sortBy === "name" || sortBy === "createdAt" ? sortBy : "createdAt"
    if (sortField === "createdAt") {
      filteredItems.sort((a: any, b: any) => {
        const aTime = new Date(a.createdAt).getTime()
        const bTime = new Date(b.createdAt).getTime()
        return sortOrder === 1 ? aTime - bTime : bTime - aTime
      })
    } else if (sortField === "price") {
      filteredItems.sort((a: any, b: any) => {
        return sortOrder === 1 ? a.price - b.price : b.price - a.price
      })
    } else if (sortField === "name") {
      filteredItems.sort((a: any, b: any) => {
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
