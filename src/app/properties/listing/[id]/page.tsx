import { notFound } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { getProperty } from "@/lib/properties/get-property"
import { normalizePropertyDetail } from "@/lib/properties/normalize-property"
import { canViewPropertySellerContact } from "@/lib/properties/property-permissions"
import PropertyDetail from "@/components/properties/property-detail"

export default async function PropertyListingPage({ params }: { params: Promise<{ id: string }> }) {
    const [{ id }, session] = await Promise.all([params, getServerSession(authOptions)])

    const raw = await getProperty(id)
    if (!raw) notFound()

    const user = session?.user ? { _id: session.user.id ?? undefined, roles: session.user.roles } : null
    const canViewContact = canViewPropertySellerContact(user)
    const property = normalizePropertyDetail(raw as never, canViewContact)

    return (
        <main className="mx-auto max-w-6xl px-4 py-8">
            <PropertyDetail property={property} canViewSellerContact={canViewContact} />
        </main>
    )
}