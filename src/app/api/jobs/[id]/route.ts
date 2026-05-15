import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { Types } from "mongoose"
import { connectToDatabase } from "@/lib/db"
import { Job } from "@/models/Job"
import { User } from "@/models/User"
import { normalizeJobDetail } from "@/lib/careers/normalize-job"
import { canDeleteCareer, canEditCareer, canViewCareerDetails } from "@/lib/careers/career-permissions"

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (!Types.ObjectId.isValid(id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 })

  await connectToDatabase()
  const session = await getServerSession()
  const canView = canViewCareerDetails(session?.user)

  const job = await Job.findByIdAndUpdate(id, { $inc: { views: 1 } }, { new: true })
    .populate("userId", "name email phone image")
    .lean()

  if (!job || Array.isArray(job) || job.status !== "active") return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json({ item: normalizeJobDetail(job, canView) })
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession()
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { id } = await params
  if (!Types.ObjectId.isValid(id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 })

  await connectToDatabase()
  const [user, job] = await Promise.all([
    User.findOne({ email: session.user.email }),
    Job.findById(id),
  ])
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })
  if (!job) return NextResponse.json({ error: "Not found" }, { status: 404 })

  if (!canDeleteCareer(user, { userId: String(job.userId) })) return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  await Job.findByIdAndDelete(id)
  return NextResponse.json({ success: true })
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession()
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { id } = await params
  if (!Types.ObjectId.isValid(id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 })
  await connectToDatabase()
  const user = await User.findOne({ email: session.user.email })
  const job = await Job.findById(id)
  if (!user || !job) return NextResponse.json({ error: "Not found" }, { status: 404 })
  if (!canEditCareer(user, { userId: String(job.userId) })) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  const body = await request.json()
  const updated = await Job.findByIdAndUpdate(id, body, { new: true }).lean()
  return NextResponse.json({ item: normalizeJobDetail(updated, true) })
}
