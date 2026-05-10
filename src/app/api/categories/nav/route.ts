import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import { Category } from "@/models/Category"

export async function GET() {
    await connectToDatabase()

    const categories = await Category.find(
        {},
        { mainCategory: 1, subcategories: 1 }
    ).lean<{ mainCategory: string; subcategories: { label: string; slug: string }[] }[]>()

    // Returns { "vehicles": [{label, href}, ...], "careers": [...], ... }
    const grouped = categories.reduce<Record<string, { label: string; href: string }[]>>(
        (acc, cat) => {
            acc[cat.mainCategory] = cat.subcategories.map((sub) => ({
                label: sub.label,
                href: `/${cat.mainCategory}/${sub.slug}`,
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