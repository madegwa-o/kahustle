import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { connectToDatabase } from "@/lib/db"
import { Role } from "@/lib/roles"
import { User } from "@/models/User"

const SELF_SERVICE_ROLES = new Set<Role>([
    Role.JOBSEEKER,
    Role.RECRUITER,
    Role.CARDEALER,
    Role.CARBUYER,
    Role.CONSTRUCTION_FREELANCER,
    Role.CONSTRUCTION_FREELANCER_SEEKER,
    Role.PROPERTY_SELLER,
    Role.PROPERTY_BUYER,
])

async function getCurrentUser() {
    const session = await getServerSession()
    if (!session?.user?.email) {
        return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) }
    }

    await connectToDatabase()

    const user = await User.findOne({ email: session.user.email })
    if (!user) {
        return { error: NextResponse.json({ error: "User not found" }, { status: 404 }) }
    }

    return { user }
}

function parseRole(rawRole: unknown) {
    if (typeof rawRole !== "string") {
        return null
    }

    if (!Object.values(Role).includes(rawRole as Role)) {
        return null
    }

    return rawRole as Role
}

export async function POST(request: NextRequest) {
    try {
        const { user, error } = await getCurrentUser()
        if (error) {
            return error
        }

        const body = await request.json()
        const role = parseRole(body?.role)

        if (!role || !SELF_SERVICE_ROLES.has(role)) {
            return NextResponse.json({ error: "Invalid role" }, { status: 400 })
        }

        user.addRole(role)
        await user.save()

        return NextResponse.json({ success: true, roles: user.roles })
    } catch (error) {
        console.error("Add role error:", error)
        return NextResponse.json({ error: "Failed to add role" }, { status: 500 })
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { user, error } = await getCurrentUser()
        if (error) {
            return error
        }

        const body = await request.json()
        const role = parseRole(body?.role)

        if (!role || !SELF_SERVICE_ROLES.has(role)) {
            return NextResponse.json({ error: "Invalid role" }, { status: 400 })
        }

        user.removeRole(role)

        if (!user.roles.length) {
            user.addRole(Role.USER)
        }

        await user.save()

        return NextResponse.json({ success: true, roles: user.roles })
    } catch (error) {
        console.error("Remove role error:", error)
        return NextResponse.json({ error: "Failed to remove role" }, { status: 500 })
    }
}