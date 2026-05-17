import { PropertyDetail } from "@/lib/properties/types"
import { formatPropertyCondition, formatSquareFeet } from "@/lib/properties/property-formatters"

export default function PropertySpecs({ property }: { property: PropertyDetail }) {
  const specs: [string, string | undefined][] = [
    ["Property type", property.propertyType],
    ["Bedrooms", property.bedrooms?.toString()],
    ["Bathrooms", property.bathrooms?.toString()],
    ["Size", formatSquareFeet(property.squareFeet)],
    ["Condition", formatPropertyCondition(property.condition)],
    ["Parking", property.parking],
    ["Year built", property.yearBuilt?.toString()],
    ["Address", property.address],
    ["City", property.city],
    ["County / State", property.state],
    ["Postal code", property.postalCode],
  ]

  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="px-4 py-3 border-b border-border">
        <h2 className="font-semibold text-foreground">Property details</h2>
      </div>
      <dl className="divide-y divide-border">
        {specs.filter(([, value]) => value).map(([label, value]) => (
          <div key={label} className="flex items-center justify-between gap-4 px-4 py-2.5">
            <dt className="text-sm text-muted-foreground">{label}</dt>
            <dd className="text-sm font-medium text-foreground capitalize text-right">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
