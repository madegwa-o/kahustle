import { ConstructionListing } from "@/lib/construction-freelancers/types"
import { formatExperience } from "@/lib/construction-freelancers/construction-formatters"

export default function ConstructionServiceMeta({ service }: { service: ConstructionListing }) {
  return <p className="text-sm text-gray-600">{service.category} • {formatExperience(service.yearsOfExperience)} • {service.serviceArea?.[0]}</p>
}
