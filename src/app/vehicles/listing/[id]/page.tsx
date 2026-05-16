import { notFound } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { getVehicle } from "@/lib/vehicles/get-vehicle"
import { normalizeVehicleDetail } from "@/lib/vehicles/normalize-vehicle"
import { canViewVehicleSellerContact } from "@/lib/vehicles/vehicle-permissions"
import VehicleDetail from "@/components/vehicles/vehicle-detail"

export default async function VehicleListingPage({ params }: { params: Promise<{ id: string }> }) {
  const [{ id }, session] = await Promise.all([params, getServerSession(authOptions)])

  const raw = await getVehicle(id)
  if (!raw) notFound()

  const user = session?.user ? { _id: session.user.id ?? undefined, roles: session.user.roles } : null
  const canViewContact = canViewVehicleSellerContact(user)
  const vehicle = normalizeVehicleDetail(raw as never, canViewContact)

  return (
      <main className="mx-auto max-w-6xl px-4 py-8">
        <VehicleDetail vehicle={vehicle} canViewSellerContact={canViewContact} />
      </main>
  )
}