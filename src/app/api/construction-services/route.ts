import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { connectToDatabase } from "@/lib/db"
import { ConstructionService } from "@/models/ConstructionService"
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
        const serviceType = searchParams.get("serviceType")
        const minExperience = searchParams.get("minExperience")
        const serviceArea = searchParams.get("serviceArea")

        const filter: any = { status }

        if (userId && Types.ObjectId.isValid(userId)) {
            filter.userId = new Types.ObjectId(userId)
        }

        if (serviceType) {
            filter.serviceType = new RegExp(serviceType, "i")
        }

        if (minExperience) {
            filter.yearsOfExperience = { $gte: parseInt(minExperience) }
        }

        if (serviceArea) {
            filter.serviceArea = serviceArea
        }

        const services = await ConstructionService.find(filter)
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip(skip)
            .lean()

        const total = await ConstructionService.countDocuments(filter)

        return NextResponse.json(
            {
                success: true,
                services,
                total,
                page: Math.floor(skip / limit) + 1,
                pages: Math.ceil(total / limit),
            },
            { status: 200 }
        )
    } catch (error) {
        console.error("GET /api/construction-services error:", error)
        return NextResponse.json(
            { success: false, error: "Failed to fetch construction services" },
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
            serviceType,
            expertise,
            yearsOfExperience,
            license,
            insurance,
            availability,
            serviceArea,
            priceType,
            certifications,
            previousProjects,
        } = body

        // Validate required fields
        if (
            !name ||
            !price ||
            !serviceType ||
            yearsOfExperience === undefined ||
            !availability ||
            !priceType
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

        if (!canCreateListing(user, MainCategory.CONSTRUCTION_FREELANCERS)) {
            return NextResponse.json(
                { success: false, error: "Forbidden" },
                { status: 403 }
            )
        }

        const constructionService = await ConstructionService.create({
            name: name.trim(),
            description: description?.trim() || "",
            price: parseFloat(price),
            userId: user._id,
            images: images || [],
            status: "active",
            views: 0,
            serviceType: serviceType.trim(),
            expertise: expertise || [],
            yearsOfExperience: parseInt(yearsOfExperience),
            license: license?.trim(),
            insurance: insurance || false,
            availability,
            serviceArea: serviceArea || [],
            priceType,
            certifications: certifications || [],
            previousProjects: previousProjects ? parseInt(previousProjects) : undefined,
        })

        return NextResponse.json(
            { success: true, service: constructionService.toObject() },
            { status: 201 }
        )
    } catch (error) {
        console.error("POST /api/construction-services error:", error)
        return NextResponse.json(
            { success: false, error: "Failed to create construction service" },
            { status: 500 }
        )
    }
}
