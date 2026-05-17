import { notFound } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { getConstructionService } from "@/lib/construction-freelancers/get-construction-service"
import { normalizeConstructionDetail } from "@/lib/construction-freelancers/normalize-construction"
import { canViewConstructionFreelancerContact } from "@/lib/construction-freelancers/construction-permissions"
import ConstructionServiceDetail from "@/components/construction-freelancers/construction-service-detail"

export default async function ConstructionListingPage({ params }: { params: Promise<{ id: string }> }) {
    const [{ id }, session] = await Promise.all([params, getServerSession(authOptions)])

    const raw = await getConstructionService(id)
    if (!raw) notFound()

    const user = session?.user ? { _id: session.user.id ?? undefined, roles: session.user.roles } : null
    const canViewContact = canViewConstructionFreelancerContact(user)
    const service = normalizeConstructionDetail(raw as never, canViewContact)

    return (
        <main className="mx-auto max-w-6xl px-4 py-8">
            <ConstructionServiceDetail service={service} canViewFreelancerContact={canViewContact} />
        </main>
    )
}