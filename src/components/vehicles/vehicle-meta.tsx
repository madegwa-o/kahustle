import { VehicleListing } from "@/lib/vehicles/types"
export default function VehicleMeta({ vehicle }: { vehicle: VehicleListing }) { return <p className="text-sm text-gray-600">{vehicle.year} • {vehicle.condition} • {vehicle.location}</p> }
