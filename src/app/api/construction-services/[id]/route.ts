import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { connectToDatabase } from "@/lib/db"
import { ConstructionService } from "@/models/ConstructionService"
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
                { success: false, error: "Invalid service ID" },
                { status: 400 }
            )
        }

        const service = await ConstructionService.findById(id)

        if (!service) {
            return NextResponse.json(
                { success: false, error: "Service not found" },
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
        const isOwner = service.userId.toString() === user?._id?.toString()
        if (!canManageAny && !isOwner) {
            return NextResponse.json(
                { success: false, error: "Unauthorized" },
                { status: 403 }
            )
        }

        await ConstructionService.findByIdAndDelete(id)

        return NextResponse.json(
            { success: true, message: "Service deleted" },
            { status: 200 }
        )
    } catch (error) {
        console.error("DELETE /api/construction-services/[id] error:", error)
        return NextResponse.json(
            { success: false, error: "Failed to delete service" },
            { status: 500 }
        )
    }
}
