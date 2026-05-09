import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { connectToDatabase } from "@/lib/db"
import { Product } from "@/models/Product"
import { Types } from "mongoose"
import { Role } from "@/models/User"

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectToDatabase()
        const { id } = await params

        if (!Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                { success: false, error: "Invalid product ID" },
                { status: 400 }
            )
        }

        const product = await Product.findById(id).populate("userId", "name email phone image")
        
        if (!product) {
            return NextResponse.json(
                { success: false, error: "Product not found" },
                { status: 404 }
            )
        }

        // Increment views
        product.views = (product.views || 0) + 1
        await product.save()

        // Get related products (same category, limit 6, exclude current)
        const related = await Product.find({
            category: product.category,
            _id: { $ne: product._id },
            status: "active",
        })
            .limit(6)
            .lean()

        return NextResponse.json(
            {
                success: true,
                product: product.toObject(),
                related,
            },
            { status: 200 }
        )
    } catch (error) {
        console.error("GET /api/products/[id] error:", error)
        return NextResponse.json(
            { success: false, error: "Failed to fetch product" },
            { status: 500 }
        )
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession()

        if (!session?.user?.email) {
            return NextResponse.json(
                { success: false, error: "Unauthorized" },
                { status: 401 }
            )
        }

        await connectToDatabase()
        const { id } = await params

        if (!Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                { success: false, error: "Invalid product ID" },
                { status: 400 }
            )
        }

        const product = await Product.findById(id)

        if (!product) {
            return NextResponse.json(
                { success: false, error: "Product not found" },
                { status: 404 }
            )
        }

        // Verify ownership
        const { User } = await import("@/models")
        const user = await User.findOne({ email: session.user.email })
        if (!user) {
            return NextResponse.json(
                { success: false, error: "User not found" },
                { status: 404 }
            )
        }

        const canManageAnyProduct = user?.hasRole?.(Role.STAFF) || user?.hasRole?.(Role.ADMIN)
        const isOwner = product.userId.toString() === user?._id?.toString()
        if (!canManageAnyProduct && !isOwner) {
            return NextResponse.json(
                { success: false, error: "Unauthorized" },
                { status: 403 }
            )
        }

        const body = await request.json()
        const { name, description, price, category, images, status } = body

        if (name) product.name = name.trim()
        if (description) product.description = description.trim()
        if (price) product.price = parseFloat(price)
        if (category) product.category = category.toLowerCase()
        if (images) product.images = images
        if (status) product.status = status

        await product.save()

        return NextResponse.json(
            { success: true, product: product.toObject() },
            { status: 200 }
        )
    } catch (error) {
        console.error("PUT /api/products/[id] error:", error)
        return NextResponse.json(
            { success: false, error: "Failed to update product" },
            { status: 500 }
        )
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession()

        if (!session?.user?.email) {
            return NextResponse.json(
                { success: false, error: "Unauthorized" },
                { status: 401 }
            )
        }

        await connectToDatabase()
        const { id } = await params

        if (!Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                { success: false, error: "Invalid product ID" },
                { status: 400 }
            )
        }

        const product = await Product.findById(id)

        if (!product) {
            return NextResponse.json(
                { success: false, error: "Product not found" },
                { status: 404 }
            )
        }

        // Verify ownership
        const { User } = await import("@/models")
        const user = await User.findOne({ email: session.user.email })
        if (!user) {
            return NextResponse.json(
                { success: false, error: "User not found" },
                { status: 404 }
            )
        }

        const canManageAnyProduct = user?.hasRole?.(Role.STAFF) || user?.hasRole?.(Role.ADMIN)
        const isOwner = product.userId.toString() === user?._id?.toString()
        if (!canManageAnyProduct && !isOwner) {
            return NextResponse.json(
                { success: false, error: "Unauthorized" },
                { status: 403 }
            )
        }

        await Product.findByIdAndDelete(id)

        return NextResponse.json(
            { success: true, message: "Product deleted" },
            { status: 200 }
        )
    } catch (error) {
        console.error("DELETE /api/products/[id] error:", error)
        return NextResponse.json(
            { success: false, error: "Failed to delete product" },
            { status: 500 }
        )
    }
}
