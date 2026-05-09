import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { connectToDatabase } from "@/lib/db"
import { User, Role } from "@/models/User"

export async function GET() {
  const session = await getServerSession()
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  await connectToDatabase()
  const me = await User.findOne({ email: session.user.email })
  if (!me || (!me.hasRole(Role.ADMIN) && !me.hasRole(Role.STAFF))) return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  const users = await User.find({}, { password: 0 }).sort({ createdAt: -1 }).lean()
  return NextResponse.json({ users })
}
