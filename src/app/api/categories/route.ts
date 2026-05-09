// app/api/categories/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { Category, MainCategory } from "@/models/Category";
import { User, Role } from "@/models/User";
import { connectToDatabase } from "@/lib/db";

// GET: fetch all subcategories grouped by parent slug
export async function GET() {
    await connectToDatabase();

    const categories = await Category.find(
        {},
        { mainCategory: 1, subcategories: 1 }
    ).lean<{ mainCategory: string; subcategories: { label: string; slug: string }[] }[]>()

    const grouped = categories.reduce<Record<string, { label: string; href: string }[]>>(
        (acc, cat) => {
            const parentSlug = cat.mainCategory // e.g. "vehicles"
            acc[parentSlug] = cat.subcategories.map((sub) => ({
                label: sub.label,
                href: `/${parentSlug}/${sub.slug}`,
            }))
            return acc
        },
        {}
    )

    return NextResponse.json(grouped, {
        headers: {
            "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=3600",
        },
    })
}

// POST: Create a new category with subcategories (EDITOR only)
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession();
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await User.findOne({ email: session.user.email });
        if (!user || !user.hasRole(Role.STAFF)) {
            return NextResponse.json({ error: "Unauthorized - EDITOR access required" }, { status: 403 });
        }

        const { mainCategory, subcategories } = await request.json();

        if (!mainCategory || !Array.isArray(subcategories) || subcategories.length === 0) {
            return NextResponse.json(
                { error: "mainCategory and at least one subcategory are required" },
                { status: 400 }
            );
        }

        if (!Object.values(MainCategory).includes(mainCategory)) {
            return NextResponse.json({ error: "Invalid main category" }, { status: 400 });
        }

        // Validate subcategory shape
        const isValid = subcategories.every(
            (s: unknown) =>
                typeof s === "object" &&
                s !== null &&
                typeof (s as Record<string, unknown>).label === "string" &&
                typeof (s as Record<string, unknown>).slug === "string"
        )
        if (!isValid) {
            return NextResponse.json(
                { error: "Each subcategory must have a label and a slug" },
                { status: 400 }
            );
        }

        await connectToDatabase();

        const existing = await Category.findOne({ mainCategory });
        if (existing) {
            return NextResponse.json({ error: "Category already exists" }, { status: 400 });
        }

        const newCategory = await Category.create({ mainCategory, subcategories });

        return NextResponse.json(
            { category: newCategory, message: "Category created successfully" },
            { status: 201 }
        );
    } catch (error) {
        console.error("Create category error:", error);
        return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
    }
}