import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { connectToDatabase } from "@/lib/db"
import { Product } from "@/models/Product"
import { Types } from "mongoose"

export async function GET(request: NextRequest) {
    try {
        await connectToDatabase()

        const { searchParams } = new URL(request.url)
        const userId = searchParams.get("userId")
        const category = searchParams.get("category")
        const status = searchParams.get("status") || "active"
        const limit = parseInt(searchParams.get("limit") || "20")
        const skip = parseInt(searchParams.get("skip") || "0")

        const filter: any = { status }

        if (userId && Types.ObjectId.isValid(userId)) {
            filter.userId = new Types.ObjectId(userId)
        }

        if (category) {
            filter.category = category.toLowerCase()
        }

        const products = await Product.find(filter)
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip(skip)
            .lean()

        const total = await Product.countDocuments(filter)

        return NextResponse.json(
            {
                success: true,
                products,
                total,
                page: Math.floor(skip / limit) + 1,
                pages: Math.ceil(total / limit),
            },
            { status: 200 }
        )
    } catch (error) {
        console.error("GET /api/products error:", error)
        return NextResponse.json(
            { success: false, error: "Failed to fetch products" },
            { status: 500 }
        )
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession()

        if (!session?.user?.email) {
            return NextResponse.json(
                { success: false, error: "Unauthorized" },
                { status: 401 }
            )
        }

        await connectToDatabase()

        const body = await request.json()
        const { name, description, price, category, images } = body

        if (!name || !price || !category) {
            return NextResponse.json(
                { success: false, error: "Missing required fields" },
                { status: 400 }
            )
        }

        // Get user ID from session
        const { User } = await import("@/models")
        const user = await User.findOne({ email: session.user.email })

        if (!user) {
            return NextResponse.json(
                { success: false, error: "User not found" },
                { status: 404 }
            )
        }

        const product = await Product.create({
            name: name.trim(),
            description: description?.trim() || "",
            price: parseFloat(price),
            category: category.toLowerCase(),
            userId: user._id,
            images: images || [],
            status: "active",
            views: 0,
        })

        return NextResponse.json(
            { success: true, product: product.toObject() },
            { status: 201 }
        )
    } catch (error) {
        console.error("POST /api/products error:", error)
        return NextResponse.json(
            { success: false, error: "Failed to create product" },
            { status: 500 }
        )
    }
}
