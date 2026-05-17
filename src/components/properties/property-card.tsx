import Link from "next/link"
import { Bath, BedDouble, Building2, Calendar, MapPin } from "lucide-react"
import { PropertyListing } from "@/lib/properties/types"
import { formatCurrency, formatPostedDate, formatPropertyCondition } from "@/lib/properties/property-formatters"

export default function PropertyCard({ property }: { property: PropertyListing }) {
  return (
    <Link
      href={property.detailUrl}
      className="group flex flex-col rounded-xl border border-border bg-card overflow-hidden hover:border-primary/40 hover:shadow-md transition-all duration-200"
    >
      <div className="relative h-48 overflow-hidden bg-muted">
        {property.image ? (
          <img src={property.image} alt={property.name ?? "Property listing"} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-muted-foreground"><Building2 className="h-12 w-12 opacity-20" /></div>
        )}
        <div className="absolute top-2.5 left-2.5 flex gap-1.5">
          {property.condition && (
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">
              {formatPropertyCondition(property.condition)}
            </span>
          )}
          {property.status === "inactive" && (
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">Inactive</span>
          )}
        </div>
      </div>

      <div className="flex flex-col flex-1 p-4">
        <h3 className="font-semibold text-foreground leading-snug line-clamp-1 mb-1">{property.name}</h3>

        <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground mb-3">
          {property.propertyType && <span className="capitalize">{property.propertyType}</span>}
          {property.bedrooms != null && <span className="flex items-center gap-1"><BedDouble className="h-3 w-3" />{property.bedrooms} beds</span>}
          {property.bathrooms != null && <span className="flex items-center gap-1"><Bath className="h-3 w-3" />{property.bathrooms} baths</span>}
        </div>

        <div className="mt-auto flex items-end justify-between">
          <div>
            <p className="text-lg font-bold text-foreground">{formatCurrency(property.price ?? 0, property.currency)}</p>
            {property.createdAt && (
              <p className="flex items-center gap-1 text-xs text-muted-foreground"><Calendar className="h-3 w-3" />{formatPostedDate(property.createdAt)}</p>
            )}
          </div>
          {property.city && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />{property.city}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
