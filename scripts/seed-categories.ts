// scripts/seed-categories.ts
import { connectToDatabase } from "@/lib/db"
import { Category } from "@/models/Category"

const seed = [
    {
        mainCategory: "vehicles",
        subcategories: [
            { label: "Cars", slug: "cars" },
            { label: "Trucks, Vans & Buses", slug: "trucks" },
        ],
    },
    {
        mainCategory: "construction-freelancers",
        subcategories: [
            { label: "Building Contractor", slug: "building-contractor" },
            { label: "General Foreman", slug: "general-foreman" },
            { label: "Site Agent", slug: "site-agent" },
            { label: "Mason / Fundi wa Mawe", slug: "mason-fundi-wa-mawe" },
            { label: "Plumber / Drainage Specialist", slug: "plumber-drainage-specialist" },
            { label: "Carpenter / Fundi wa Mbao", slug: "carpenter-fundi-wa-mbao" },
            { label: "Steel Fixer", slug: "steel-fixer" },
            { label: "Concreting Specialist", slug: "concreting-specialist" },
            { label: "Architect", slug: "architect" },
            { label: "Architectural Drafter", slug: "architectural-drafter" },
            { label: "Interior Designer", slug: "interior-designer" },
            { label: "Construction Project Manager", slug: "construction-project-manager" },
            { label: "Site Supervisor / Clerk of Works", slug: "site-supervisor-clerk-of-works" },
            { label: "Landscape Architect", slug: "landscape-architect" },
            { label: "Structural Engineer", slug: "structural-engineer" },
            { label: "Civil Engineer", slug: "civil-engineer" },
            { label: "Mechanical Engineer", slug: "mechanical-engineer" },
            { label: "Scaffolding Specialist", slug: "scaffolding-specialist" },
            { label: "Roofing Installer", slug: "roofing-installer" },
            { label: "Painter", slug: "painter" },
            { label: "Tiler", slug: "tiler" },
            { label: "Plastering Specialist", slug: "plastering-specialist" },
            { label: "Cabinet Maker / Joiner", slug: "cabinet-maker-joiner" },
            { label: "Kitchen Fitter", slug: "kitchen-fitter" },
            { label: "Wardrobe Installer", slug: "wardrobe-installer" },
            { label: "Aluminium & Glass Fabricator", slug: "aluminium-glass-fabricator" },
            { label: "Curtain Wall Installer", slug: "curtain-wall-installer" },
            { label: "Flooring Specialist", slug: "flooring-specialist" },
            { label: "Drywall Installer", slug: "drywall-installer" },
            { label: "Ceiling Installer", slug: "ceiling-installer" },
            { label: "Waterproofing Specialist", slug: "waterproofing-specialist" },
            { label: "Demolition Worker", slug: "demolition-worker" },
            { label: "Excavator Operator", slug: "excavator-operator" },
            { label: "Machine Operator", slug: "machine-operator" },
            { label: "Heavy Equipment Operator", slug: "heavy-equipment-operator" },
            { label: "Welding & Fabrication Specialist", slug: "welding-fabrication-specialist" },
            // { label: "Roadworks Contractor", slug: "roadworks-contractor" },
        ],
    },
    {
        mainCategory: "careers",
        subcategories: [
            { label: "Employers", slug: "employers" },
            { label: "Jobseeker", slug: "jobseekers" },
        ],
    },
    {
        mainCategory: "properties",
        subcategories: [
            { label: "Apartments & Flats", slug: "apartments" },
            { label: "Houses", slug: "houses" },
            { label: "Commercial Property", slug: "commercial" },
            { label: "Plots & Land", slug: "plots" },
        ],
    },
]

async function main() {
    await connectToDatabase()
    await Category.deleteMany({})
    await Category.insertMany(seed)
    console.log("✓ Seeded categories")
    process.exit(0)
}

main().catch((e) => { console.error(e); process.exit(1) })