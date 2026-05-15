import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { connectToDatabase } from "@/lib/db"
import { Property } from "@/models/Property"
import { User } from "@/models/User"
import { MainCategory } from "@/lib/categories"
import { canCreateListing } from "@/lib/permissions"
import { Types } from "mongoose"

export async function GET(request: NextRequest) {
    try {
        await connectToDatabase()

        const { searchParams } = new URL(request.url)
        const userId = searchParams.get("userId")
        const status = searchParams.get("status") || "active"
        const limit = parseInt(searchParams.get("limit") || "20")
        const skip = parseInt(searchParams.get("skip") || "0")
        const city = searchParams.get("city")
        const propertyType = searchParams.get("propertyType")
        const minPrice = searchParams.get("minPrice")
        const maxPrice = searchParams.get("maxPrice")
        const minBedrooms = searchParams.get("minBedrooms")

        const filter: any = { status }

        if (userId && Types.ObjectId.isValid(userId)) {
            filter.userId = new Types.ObjectId(userId)
        }

        if (city) {
            filter.city = new RegExp(city, "i")
        }

        if (propertyType) {
            filter.propertyType = propertyType.toLowerCase()
        }

        if (minPrice || maxPrice) {
            filter.price = {}
            if (minPrice) filter.price.$gte = parseFloat(minPrice)
            if (maxPrice) filter.price.$lte = parseFloat(maxPrice)
        }

        if (minBedrooms) {
            filter.bedrooms = { $gte: parseInt(minBedrooms) }
        }

        const properties = await Property.find(filter)
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip(skip)
            .lean()

        const total = await Property.countDocuments(filter)

        return NextResponse.json(
            {
                success: true,
                properties,
                total,
                page: Math.floor(skip / limit) + 1,
                pages: Math.ceil(total / limit),
            },
            { status: 200 }
        )
    } catch (error) {
        console.error("GET /api/properties error:", error)
        return NextResponse.json(
            { success: false, error: "Failed to fetch properties" },
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
        const {
            name,
            description,
            price,
            images,
            propertyType,
            bedrooms,
            bathrooms,
            squareFeet,
            address,
            city,
            state,
            postalCode,
            amenities,
            yearBuilt,
            parking,
            condition,
        } = body

        // Validate required fields
        if (
            !name ||
            !price ||
            !propertyType ||
            bedrooms === undefined ||
            bathrooms === undefined ||
            !squareFeet ||
            !address ||
            !city ||
            !state ||
            !postalCode ||
            !condition
        ) {
            return NextResponse.json(
                { success: false, error: "Missing required fields" },
                { status: 400 }
            )
        }

        // Get user ID from session
        const user = await User.findOne({ email: session.user.email })

        if (!user) {
            return NextResponse.json(
                { success: false, error: "User not found" },
                { status: 404 }
            )
        }

        if (!canCreateListing(user, MainCategory.PROPERTIES)) {
            return NextResponse.json(
                { success: false, error: "Forbidden" },
                { status: 403 }
            )
        }

        const property = await Property.create({
            name: name.trim(),
            description: description?.trim() || "",
            price: parseFloat(price),
            userId: user._id,
            images: images || [],
            status: "active",
            views: 0,
            propertyType: propertyType.toLowerCase(),
            bedrooms: parseInt(bedrooms),
            bathrooms: parseFloat(bathrooms),
            squareFeet: parseFloat(squareFeet),
            address: address.trim(),
            city: city.trim(),
            state: state.trim(),
            postalCode: postalCode.trim(),
            amenities: amenities || [],
            yearBuilt: yearBuilt ? parseInt(yearBuilt) : undefined,
            parking: parking || "street",
            condition,
        })

        return NextResponse.json(
            { success: true, property: property.toObject() },
            { status: 201 }
        )
    } catch (error) {
        console.error("POST /api/properties error:", error)
        return NextResponse.json(
            { success: false, error: "Failed to create property" },
            { status: 500 }
        )
    }
}
