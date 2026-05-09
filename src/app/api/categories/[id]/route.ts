import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { Category } from "@/models/Category";
import { User, Role } from "@/models/User";
import { connectToDatabase } from "@/lib/db";

// GET: Retrieve specific category
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        await connectToDatabase();
        const category = await Category.findById(id);
        if (!category) {
            return NextResponse.json(
                { error: "Category not found" },
                { status: 404 }
            );
        }
        return NextResponse.json({ category }, { status: 200 });
    } catch (error) {
        console.error("Get category error:", error);
        return NextResponse.json(
            { error: "Failed to retrieve category" },
            { status: 500 }
        );
    }
}

// PATCH: Update category (STAFF only)
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        const session = await getServerSession();
        if (!session || !session.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await User.findOne({ email: session.user.email });
        if (!user || !user.hasRole(Role.EDITOR)) {
            return NextResponse.json(
                { error: "Unauthorized - STAFF access required" },
                { status: 403 }
            );
        }

        const { subcategories } = await request.json();
        if (!subcategories || !Array.isArray(subcategories) || subcategories.length === 0) {
            return NextResponse.json(
                { error: "At least one subcategory is required" },
                { status: 400 }
            );
        }

        await connectToDatabase();
        const category = await Category.findByIdAndUpdate(
            id,
            { subcategories },
            { new: true }
        );
        if (!category) {
            return NextResponse.json({ error: "Category not found" }, { status: 404 });
        }

        return NextResponse.json(
            { category, message: "Category updated successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Update category error:", error);
        return NextResponse.json(
            { error: "Failed to update category" },
            { status: 500 }
        );
    }
}

// DELETE: Delete category (STAFF only)
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        const session = await getServerSession();
        if (!session || !session.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await User.findOne({ email: session.user.email });
        if (!user || !user.hasRole(Role.EDITOR)) {
            return NextResponse.json(
                { error: "Unauthorized - STAFF access required" },
                { status: 403 }
            );
        }

        await connectToDatabase();
        const category = await Category.findByIdAndDelete(id);
        if (!category) {
            return NextResponse.json({ error: "Category not found" }, { status: 404 });
        }

        return NextResponse.json(
            { message: "Category deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Delete category error:", error);
        return NextResponse.json(
            { error: "Failed to delete category" },
            { status: 500 }
        );
    }
}