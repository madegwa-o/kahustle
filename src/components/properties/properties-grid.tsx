import { VehicleListing } from "@/lib/vehicles/types"
import PropertyCard from "./property-card"

export default function PropertiesGrid({ vehicles }: { vehicles: VehicleListing[] }) {
  return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {vehicles.map((v) => <PropertyCard key={v.id} vehicle={v} />)}
      </div>
  )
}