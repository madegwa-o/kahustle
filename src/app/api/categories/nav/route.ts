import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import { Category } from "@/models/Category"
import { MainCategory } from "@/lib/categories"

const CATEGORY_ROUTE_SLUGS: Record<MainCategory, string> = {
    [MainCategory.VEHICLES]: "vehicles",
    [MainCategory.CONSTRUCTION_FREELANCERS]: "construction-freelancers",
    [MainCategory.CAREERS]: "careers",
    [MainCategory.PROPERTIES]: "properties",
}

export async function GET() {
    await connectToDatabase()

    const categories = await Category.find(
        {},
        { mainCategory: 1, subcategories: 1 }
    ).lean<{ mainCategory: MainCategory; subcategories: { label: string; slug: string }[] }[]>()

    const grouped = categories.reduce<Record<string, { label: string; href: string }[]>>(
        (acc, cat) => {
            const routeSlug = CATEGORY_ROUTE_SLUGS[cat.mainCategory]
            if (!routeSlug) return acc

            acc[routeSlug] = cat.subcategories.map((sub) => ({
                label: sub.label,
                href: `/${routeSlug}/${sub.slug}`,
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
