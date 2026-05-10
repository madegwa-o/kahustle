import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { MembershipPlan, PlanCategory, PlanType } from "@/models/MembershipPlan";
import { User } from "@/models/User";
import { connectToDatabase } from "@/lib/db";

const PLAN_PRICING = {
    [PlanType.SILVER]: 4000,
    [PlanType.GOLD]: 5000,
};

const PLAN_DURATION_DAYS = 90;

// GET: Retrieve user's subscriptions
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession();

        if (!session || !session.user?.email) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        await connectToDatabase();

        const user = await User.findOne({ email: session.user.email });
        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        const subscriptions = await MembershipPlan.find({
            userId: user._id,
            status: "active",
        }).sort({ endDate: -1 });

        const now = new Date();
        const activeSubscriptions = subscriptions.filter(
            (sub) => new Date(sub.endDate) > now
        );

        return NextResponse.json(
            {
                subscriptions: activeSubscriptions,
                totalCount: activeSubscriptions.length,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Get subscriptions error:", error);
        return NextResponse.json(
            { error: "Failed to retrieve subscriptions" },
            { status: 500 }
        );
    }
}

// POST: Create new subscription
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession();

        if (!session || !session.user?.email) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { planType, category } = await request.json();

        if (!planType || !category) {
            return NextResponse.json(
                { error: "Plan type and category are required" },
                { status: 400 }
            );
        }

        // Validate plan type and category
        if (!Object.values(PlanType).includes(planType)) {
            return NextResponse.json(
                { error: "Invalid plan type" },
                { status: 400 }
            );
        }

        if (!Object.values(PlanCategory).includes(category)) {
            return NextResponse.json(
                { error: "Invalid category" },
                { status: 400 }
            );
        }

        await connectToDatabase();

        const user = await User.findOne({ email: session.user.email });
        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        // Check if user has existing subscription in this category
        const existingSubscription = await MembershipPlan.findOne({
            userId: user._id,
            category,
            status: "active",
            endDate: { $gt: new Date() },
        });

        let discountApplied = false;
        if (existingSubscription) {
            discountApplied = true;
        }

        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + PLAN_DURATION_DAYS);

        const price = PLAN_PRICING[planType as PlanType] ?? 4000;

        const newSubscription = new MembershipPlan({
            userId: user._id,
            planType,
            category,
            startDate,
            endDate,
            status: "active",
            price,
            discountApplied,
        });

        await newSubscription.save();

        return NextResponse.json(
            {
                subscription: newSubscription,
                message: "Subscription created successfully",
                discount: discountApplied ? "25%" : null,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Create subscription error:", error);
        return NextResponse.json(
            { error: "Failed to create subscription" },
            { status: 500 }
        );
    }
}
