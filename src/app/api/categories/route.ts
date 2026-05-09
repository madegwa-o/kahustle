import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { Category, MainCategory } from "@/models/Category";
import { User, Role } from "@/models/User";
import { connectToDatabase } from "@/lib/db";

// GET: Retrieve all categories
export async function GET(request: NextRequest) {
    try {
        await connectToDatabase();

        const categories = await Category.find().sort({ mainCategory: 1 });

        return NextResponse.json(
            { categories },
            { status: 200 }
        );
    } catch (error) {
        console.error("Get categories error:", error);
        return NextResponse.json(
            { error: "Failed to retrieve categories" },
            { status: 500 }
        );
    }
}

// POST: Create new category (STAFF only)
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession();

        if (!session || !session.user?.email) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        // Check if user is STAFF
        const user = await User.findOne({ email: session.user.email });
        if (!user || !user.hasRole(Role.EDITOR)) {
            return NextResponse.json(
                { error: "Unauthorized - STAFF access required" },
                { status: 403 }
            );
        }

        const { mainCategory, subcategories } = await request.json();

        if (!mainCategory || !subcategories || !Array.isArray(subcategories) || subcategories.length === 0) {
            return NextResponse.json(
                { error: "Main category and at least one subcategory are required" },
                { status: 400 }
            );
        }

        if (!Object.values(MainCategory).includes(mainCategory)) {
            return NextResponse.json(
                { error: "Invalid main category" },
                { status: 400 }
            );
        }

        await connectToDatabase();

        // Check if category already exists
        const existingCategory = await Category.findOne({ mainCategory });
        if (existingCategory) {
            return NextResponse.json(
                { error: "Category already exists" },
                { status: 400 }
            );
        }

        const newCategory = new Category({
            mainCategory,
            subcategories,
        });

        await newCategory.save();

        return NextResponse.json(
            { category: newCategory, message: "Category created successfully" },
            { status: 201 }
        );
    } catch (error) {
        console.error("Create category error:", error);
        return NextResponse.json(
            { error: "Failed to create category" },
            { status: 500 }
        );
    }
}
