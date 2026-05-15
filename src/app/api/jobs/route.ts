import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { connectToDatabase } from "@/lib/db"
import { Job } from "@/models/Job"
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
        const jobTitle = searchParams.get("jobTitle")
        const company = searchParams.get("company")
        const employmentType = searchParams.get("employmentType")
        const location = searchParams.get("location")

        const filter: any = { status }

        if (userId && Types.ObjectId.isValid(userId)) {
            filter.userId = new Types.ObjectId(userId)
        }

        if (jobTitle) {
            filter.jobTitle = new RegExp(jobTitle, "i")
        }

        if (company) {
            filter.company = new RegExp(company, "i")
        }

        if (employmentType) {
            filter.employmentType = employmentType.toLowerCase()
        }

        if (location) {
            filter.location = new RegExp(location, "i")
        }

        const jobs = await Job.find(filter)
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip(skip)
            .lean()

        const total = await Job.countDocuments(filter)

        return NextResponse.json(
            {
                success: true,
                jobs,
                total,
                page: Math.floor(skip / limit) + 1,
                pages: Math.ceil(total / limit),
            },
            { status: 200 }
        )
    } catch (error) {
        console.error("GET /api/jobs error:", error)
        return NextResponse.json(
            { success: false, error: "Failed to fetch jobs" },
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
            jobTitle,
            company,
            industry,
            employmentType,
            location,
            remote,
            salaryMin,
            salaryMax,
            currency,
            responsibilities,
            qualifications,
            benefits,
            deadline,
        } = body

        // Validate required fields
        if (
            !name ||
            !price ||
            !jobTitle ||
            !company ||
            !industry ||
            !employmentType ||
            !location ||
            salaryMin === undefined ||
            salaryMax === undefined
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

        if (!canCreateListing(user, MainCategory.CAREERS)) {
            return NextResponse.json(
                { success: false, error: "Forbidden" },
                { status: 403 }
            )
        }

        const job = await Job.create({
            name: name.trim(),
            description: description?.trim() || "",
            price: parseFloat(price),
            userId: user._id,
            images: images || [],
            status: "active",
            views: 0,
            jobTitle: jobTitle.trim(),
            company: company.trim(),
            industry: industry.trim(),
            employmentType: employmentType.toLowerCase(),
            location: location.trim(),
            remote: remote || false,
            salaryMin: parseFloat(salaryMin),
            salaryMax: parseFloat(salaryMax),
            currency: currency || "USD",
            responsibilities: responsibilities || [],
            qualifications: qualifications || [],
            benefits: benefits || [],
            deadline: deadline ? new Date(deadline) : undefined,
        })

        return NextResponse.json(
            { success: true, job: job.toObject() },
            { status: 201 }
        )
    } catch (error) {
        console.error("POST /api/jobs error:", error)
        return NextResponse.json(
            { success: false, error: "Failed to create job" },
            { status: 500 }
        )
    }
}
