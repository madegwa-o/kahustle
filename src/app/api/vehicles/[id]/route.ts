// app/api/vehicles/[id]/route.ts
import { getVehicle } from "@/lib/vehicles/get-vehicle"
import { normalizeVehicleDetail } from "@/lib/vehicles/normalize-vehicle"
import { canViewVehicleSellerContact } from "@/lib/vehicles/vehicle-permissions"
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const [session, { id }] = await Promise.all([
    getServerSession(authOptions),
    params,
  ])

  const vehicle = await getVehicle(id)
  if (!vehicle) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 })

  const user = session?.user ? { _id: session.user.id ?? undefined, roles: session.user.roles } : null
  const canViewContact = canViewVehicleSellerContact(user)

  return NextResponse.json({ success: true, data: normalizeVehicleDetail(vehicle, canViewContact) })
}