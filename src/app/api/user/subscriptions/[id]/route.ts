import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { MembershipPlan } from "@/models/MembershipPlan";
import { User } from "@/models/User";
import { connectDB } from "@/lib/db";
import { Types } from "mongoose";

// GET: Retrieve specific subscription
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession();

        if (!session || !session.user?.email) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        await connectDB();

        const user = await User.findOne({ email: session.user.email });
        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        const subscription = await MembershipPlan.findOne({
            _id: params.id,
            userId: user._id,
        });

        if (!subscription) {
            return NextResponse.json(
                { error: "Subscription not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { subscription },
            { status: 200 }
        );
    } catch (error) {
        console.error("Get subscription error:", error);
        return NextResponse.json(
            { error: "Failed to retrieve subscription" },
            { status: 500 }
        );
    }
}

// PATCH: Update subscription
export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession();

        if (!session || !session.user?.email) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { status } = await request.json();

        if (!status || !["active", "inactive", "cancelled", "expired"].includes(status)) {
            return NextResponse.json(
                { error: "Invalid status" },
                { status: 400 }
            );
        }

        await connectDB();

        const user = await User.findOne({ email: session.user.email });
        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        const subscription = await MembershipPlan.findOneAndUpdate(
            { _id: params.id, userId: user._id },
            { status },
            { new: true }
        );

        if (!subscription) {
            return NextResponse.json(
                { error: "Subscription not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { subscription, message: "Subscription updated successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Update subscription error:", error);
        return NextResponse.json(
            { error: "Failed to update subscription" },
            { status: 500 }
        );
    }
}

// DELETE: Cancel subscription
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession();

        if (!session || !session.user?.email) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        await connectDB();

        const user = await User.findOne({ email: session.user.email });
        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        const subscription = await MembershipPlan.findOneAndUpdate(
            { _id: params.id, userId: user._id },
            { status: "cancelled" },
            { new: true }
        );

        if (!subscription) {
            return NextResponse.json(
                { error: "Subscription not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { subscription, message: "Subscription cancelled successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Cancel subscription error:", error);
        return NextResponse.json(
            { error: "Failed to cancel subscription" },
            { status: 500 }
        );
    }
}
