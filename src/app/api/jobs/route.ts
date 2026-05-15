import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { connectToDatabase } from "@/lib/db"
import { Job } from "@/models/Job"
import { User } from "@/models/User"
import { buildCareerFilter, buildCareerSort, parsePagination } from "@/lib/careers/career-queries"
import { normalizeJobCard } from "@/lib/careers/normalize-job"
import { canCreateCareer } from "@/lib/careers/career-permissions"

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase()
    const { searchParams } = new URL(request.url)
    const { page, limit, skip } = parsePagination(searchParams)
    const filter = buildCareerFilter(searchParams)
    const sort = buildCareerSort(searchParams) as unknown as Record<string, 1 | -1>

    const [jobs, total] = await Promise.all([
      Job.find(filter).sort(sort).skip(skip).limit(limit).lean(),
      Job.countDocuments(filter),
    ])

    return NextResponse.json({
      items: (jobs as any[]).map((job) => normalizeJobCard(job as any)),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    })
  } catch {
    return NextResponse.json({ error: "Failed to fetch careers" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    await connectToDatabase()
    const user = await User.findOne({ email: session.user.email })
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })
    if (!canCreateCareer(user)) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

    const body = await request.json()
    const job = await Job.create({ ...body, userId: user._id, status: "active", views: 0 })
    return NextResponse.json({ item: normalizeJobCard(job.toObject()) }, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Failed to create career" }, { status: 500 })
  }
}
