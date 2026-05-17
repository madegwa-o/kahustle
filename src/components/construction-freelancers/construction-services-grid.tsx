import { VehicleListing } from "@/lib/vehicles/types"
import ConstructionServiceCard from "./construction-service-card"

export default function ConstructionServicesGrid({ vehicles }: { vehicles: VehicleListing[] }) {
  return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {vehicles.map((v) => <ConstructionServiceCard key={v.id} vehicle={v} />)}
      </div>
  )
}