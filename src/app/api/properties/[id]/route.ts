import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { connectToDatabase } from "@/lib/db"
import { Property } from "@/models/Property"
import { Types } from "mongoose"
import { Role } from "@/lib/roles"

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
                { success: false, error: "Invalid property ID" },
                { status: 400 }
            )
        }

        const property = await Property.findById(id)

        if (!property) {
            return NextResponse.json(
                { success: false, error: "Property not found" },
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

        const canManageAny = user?.hasRole?.(Role.STAFF) || user?.hasRole?.(Role.ADMIN)
        const isOwner = property.userId.toString() === user?._id?.toString()
        if (!canManageAny && !isOwner) {
            return NextResponse.json(
                { success: false, error: "Unauthorized" },
                { status: 403 }
            )
        }

        await Property.findByIdAndDelete(id)

        return NextResponse.json(
            { success: true, message: "Property deleted" },
            { status: 200 }
        )
    } catch (error) {
        console.error("DELETE /api/properties/[id] error:", error)
        return NextResponse.json(
            { success: false, error: "Failed to delete property" },
            { status: 500 }
        )
    }
}
