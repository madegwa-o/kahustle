
// lib/vehicles/normalize-vehicle.ts
import { IVehicle } from "@/models/Vehicle"
import { formatVehicleTitle } from "./vehicle-formatters"
import {Types} from "mongoose";

type SellerShape = { _id?: { toString(): string }; name?: string; email?: string; phone?: string; location?: string }

export type AnyVehicle = Partial<IVehicle> & {
  _id: Types.ObjectId | { toString(): string } | string
  userId?: SellerShape
  location?: string
}

export function normalizeVehicleListing(vehicle: AnyVehicle) {
  const id = typeof vehicle._id === "string" ? vehicle._id : vehicle._id.toString()
  return {
    id,
    name: formatVehicleTitle(vehicle.make, vehicle.vehicleModel, vehicle.year),
    subcategory: vehicle.subcategory,
    make: vehicle.make,
    vehicleModel: vehicle.vehicleModel,
    year: vehicle.year,
    mileage: vehicle.mileage,
    fuelType: vehicle.fuelType,
    transmission: vehicle.transmission,
    bodyType: vehicle.bodyType,
    color: vehicle.color,
    condition: vehicle.condition,
    price: vehicle.price,
    currency: "KES",
    image: vehicle.images?.[0] || null,
    location: vehicle.location || "Kenya",
    createdAt: vehicle.createdAt,
    detailUrl: `/vehicles/listing/${id}`,
    status: vehicle.status,
  }
}

export function normalizeVehicleDetail(vehicle: AnyVehicle, canViewSellerContact: boolean, related: AnyVehicle[] = []) {
  const listing = normalizeVehicleListing(vehicle)
  const seller = vehicle.userId && typeof vehicle.userId === "object" ? {
    id: vehicle.userId._id?.toString?.() || "",
    name: vehicle.userId.name,
    location: vehicle.userId.location || "",
    ...(canViewSellerContact ? { email: vehicle.userId.email, phone: vehicle.userId.phone } : {}),
  } : null

  return {
    ...listing,
    description: vehicle.description || "",
    views: vehicle.views || 0,
    vin: vehicle.vin || null,
    images: vehicle.images || [],
    seller,
    relatedVehicles: related.map(normalizeVehicleListing),
  }
}


export type VehicleListing = ReturnType<typeof normalizeVehicleListing>
export type VehicleDetail = ReturnType<typeof normalizeVehicleDetail>