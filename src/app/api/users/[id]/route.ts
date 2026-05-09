import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { connectToDatabase } from "@/lib/db"
import { User, Role } from "@/models/User"

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession()
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  await connectToDatabase()
  const me = await User.findOne({ email: session.user.email })
  if (!me || (!me.hasRole(Role.ADMIN) && !me.hasRole(Role.EDITOR))) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  const { id } = await params
  const body = await request.json()
  const update: Record<string, unknown> = {}
  if (typeof body.isActive === "boolean") update.isActive = body.isActive

  if (Array.isArray(body.roles)) {
    if (!me.hasRole(Role.ADMIN)) return NextResponse.json({ error: "Only admins can manage roles" }, { status: 403 })
    update.roles = body.roles
  }

  const user = await User.findByIdAndUpdate(id, update, { new: true, runValidators: true })
  return NextResponse.json({ user })
}
