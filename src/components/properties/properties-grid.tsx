import { PropertyListing } from "@/lib/properties/types"
import PropertyCard from "./property-card"

export default function PropertiesGrid({ properties }: { properties: PropertyListing[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {properties.map((property) => <PropertyCard key={property.id} property={property} />)}
    </div>
  )
}
