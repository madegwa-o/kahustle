// app/api/vehicles/route.ts
import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import { IVehicle, Vehicle } from "@/models/Vehicle"
import { buildVehicleQuery, normalizeVehiclePagination, vehicleSortToMongo } from "@/lib/vehicles/vehicle-queries"
import { normalizeVehicleListing } from "@/lib/vehicles/normalize-vehicle"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { canCreateVehicle } from "@/lib/vehicles/vehicle-permissions"

const LISTING_FIELDS =
    "make vehicleModel year mileage fuelType transmission bodyType color condition price images location status createdAt userId"

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase()
    const { searchParams } = new URL(request.url)
    const filter = buildVehicleQuery(searchParams)
    const { page, limit, skip } = normalizeVehiclePagination(searchParams)
    const sort = vehicleSortToMongo(searchParams.get("sort"))
    const [vehicles, total] = await Promise.all([
      Vehicle.find(filter).select(LISTING_FIELDS).sort(sort).skip(skip).limit(limit).lean<IVehicle[]>(),
      Vehicle.countDocuments(filter),
    ])
    return NextResponse.json({
      success: true,
      data: vehicles.map(normalizeVehicleListing),
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    })
  } catch (error) {
    console.error("GET /api/vehicles error", error)
    return NextResponse.json({ success: false, error: "Failed to fetch vehicles" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const user = session?.user ? { _id: session.user.id ?? undefined, roles: session.user.roles } : null

    if (!user?._id) {
      return NextResponse.json({ success: false, error: "Unauthorised" }, { status: 401 })
    }
    if (!canCreateVehicle(user)) {
      return NextResponse.json({ success: false, error: "Forbidden — CARDEALER role required" }, { status: 403 })
    }

    await connectToDatabase()
    const body = await request.json()

    const vehicle = await Vehicle.create({
      ...body,
      userId: user._id,
      status: "active",
    })

    return NextResponse.json({ success: true, data: normalizeVehicleListing(vehicle.toObject()) }, { status: 201 })
  } catch (error: unknown) {
    console.error("POST /api/vehicles error", error)
    const message = error instanceof Error ? error.message : "Failed to create vehicle"
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}