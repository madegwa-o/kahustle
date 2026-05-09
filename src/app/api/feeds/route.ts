import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import { Product } from "@/models/Product"

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

    const filter: Record<string, unknown> = { status: "active" }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ]
    }

    if (categories.length > 0) {
      filter.category = { $in: categories }
    }

    if (priceMin || priceMax) {
      filter.price = {
        ...(priceMin ? { $gte: Number.parseFloat(priceMin) } : {}),
        ...(priceMax ? { $lte: Number.parseFloat(priceMax) } : {}),
      }
    }

    const skip = (page - 1) * limit
    const sort: Record<string, 1 | -1> = {
      [sortBy === "price" || sortBy === "name" || sortBy === "createdAt" ? sortBy : "createdAt"]: sortOrder,
    }

    const [products, totalCount] = await Promise.all([
      Product.find(filter).sort(sort).skip(skip).limit(limit).lean(),
      Product.countDocuments(filter),
    ])

    const totalPages = Math.max(1, Math.ceil(totalCount / limit))

    return NextResponse.json({
      products,
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
