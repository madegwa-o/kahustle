import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { connectToDatabase } from "@/lib/db"
import { Vehicle } from "@/models/Vehicle"
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
        const make = searchParams.get("make")
        const minYear = searchParams.get("minYear")
        const maxYear = searchParams.get("maxYear")

        const filter: any = { status }

        if (userId && Types.ObjectId.isValid(userId)) {
            filter.userId = new Types.ObjectId(userId)
        }

        if (make) {
            filter.make = new RegExp(make, "i")
        }

        if (minYear || maxYear) {
            filter.year = {}
            if (minYear) filter.year.$gte = parseInt(minYear)
            if (maxYear) filter.year.$lte = parseInt(maxYear)
        }

        const vehicles = await Vehicle.find(filter)
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip(skip)
            .lean()

        const total = await Vehicle.countDocuments(filter)

        return NextResponse.json(
            {
                success: true,
                vehicles,
                total,
                page: Math.floor(skip / limit) + 1,
                pages: Math.ceil(total / limit),
            },
            { status: 200 }
        )
    } catch (error) {
        console.error("GET /api/vehicles error:", error)
        return NextResponse.json(
            { success: false, error: "Failed to fetch vehicles" },
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
            make,
            vehicleModel,
            year,
            mileage,
            fuelType,
            transmission,
            bodyType,
            color,
            condition,
            vin,
        } = body

        // Validate required fields
        if (
            !name ||
            !price ||
            !make ||
            !vehicleModel ||
            !year ||
            !mileage ||
            !fuelType ||
            !transmission ||
            !bodyType ||
            !color ||
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

        if (!canCreateListing(user, MainCategory.VEHICLES)) {
            return NextResponse.json(
                { success: false, error: "Forbidden" },
                { status: 403 }
            )
        }

        const vehicle = await Vehicle.create({
            name: name.trim(),
            description: description?.trim() || "",
            price: parseFloat(price),
            userId: user._id,
            images: images || [],
            status: "active",
            views: 0,
            make: make.trim(),
            vehicleModel: vehicleModel.trim(),
            year: parseInt(year),
            mileage: parseFloat(mileage),
            fuelType,
            transmission,
            bodyType: bodyType.trim(),
            color: color.trim(),
            condition,
            vin: vin?.trim(),
        })

        return NextResponse.json(
            { success: true, vehicle: vehicle.toObject() },
            { status: 201 }
        )
    } catch (error) {
        console.error("POST /api/vehicles error:", error)
        return NextResponse.json(
            { success: false, error: "Failed to create vehicle" },
            { status: 500 }
        )
    }
}
