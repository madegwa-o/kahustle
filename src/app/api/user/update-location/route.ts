import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { User } from "@/models/User";
import { connectToDatabase } from "@/lib/db";

export async function PATCH(request: NextRequest) {
    try {
        const session = await getServerSession();

        if (!session || !session.user?.email) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { location } = await request.json();

        if (location === undefined || location === null) {
            return NextResponse.json(
                { error: "Location is required" },
                { status: 400 }
            );
        }

        if (typeof location !== "string") {
            return NextResponse.json(
                { error: "Location must be a string" },
                { status: 400 }
            );
        }

        if (location.trim().length === 0) {
            return NextResponse.json(
                { error: "Location cannot be empty" },
                { status: 400 }
            );
        }

        await connectToDatabase();

        const user = await User.findOneAndUpdate(
            { email: session.user.email },
            { location: location.trim() },
            { new: true }
        );

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                message: "Location updated successfully",
                location: user.location,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Update location error:", error);
        return NextResponse.json(
            { error: "Failed to update location" },
            { status: 500 }
        );
    }
}
