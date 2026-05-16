import { VehicleListing } from "@/lib/vehicles/types"
import VehicleCard from "./vehicle-card"

export default function VehiclesGrid({ vehicles }: { vehicles: VehicleListing[] }) {
  return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {vehicles.map((v) => <VehicleCard key={v.id} vehicle={v} />)}
      </div>
  )
}