import { ConstructionListing } from "@/lib/construction-freelancers/types"
import ConstructionServiceCard from "./construction-service-card"

export default function ConstructionServicesGrid({ services }: { services: ConstructionListing[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {services.map((service) => <ConstructionServiceCard key={service.id} service={service} />)}
    </div>
  )
}
