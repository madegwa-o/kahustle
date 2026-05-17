import { PropertyListing } from "@/lib/properties/types"

export default function PropertyMeta({ property }: { property: PropertyListing }) {
  return <p className="text-sm text-gray-600">{property.propertyType} • {property.condition} • {property.city}</p>
}
