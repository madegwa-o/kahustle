// lib/vehicles/get-vehicle.ts
import { connectToDatabase } from "@/lib/db"
import { Vehicle } from "@/models/Vehicle"
import { IVehicle } from "@/models/Vehicle"

export async function getVehicle(id: string) {
    await connectToDatabase()
    const vehicle = await Vehicle.findByIdAndUpdate(
        id,
        { $inc: { views: 1 } },
        { new: true }
    )
        .populate("userId", "name email phone location")
        .lean<IVehicle>()

    if (!vehicle || Array.isArray(vehicle) || vehicle.status !== "active") return null
    return vehicle
}