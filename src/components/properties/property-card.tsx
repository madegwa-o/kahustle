import Link from "next/link"
import { Bath, BedDouble, Building2, Calendar, MapPin } from "lucide-react"
import { PropertyListing } from "@/lib/properties/types"
import { formatCurrency, formatPostedDate, formatPropertyCondition } from "@/lib/properties/property-formatters"

export default function PropertyCard({ property }: { property: PropertyListing }) {
  return (
    <Link
      href={property.detailUrl}
      className="group flex flex-col rounded-lg border border-border bg-card overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
    >
      <div className="relative h-48 overflow-hidden bg-muted">
        {property.image ? (
          <img src={property.image} alt={property.name ?? "Property listing"} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-muted-foreground"><Building2 className="h-12 w-12 opacity-20" /></div>
        )}
        <div className="absolute top-3 left-3 flex gap-2">
          {property.condition && (
            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-primary/10 text-primary">
              {formatPropertyCondition(property.condition)}
            </span>
          )}
          {property.status === "inactive" && (
            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-amber-100 text-amber-800">Inactive</span>
          )}
        </div>
      </div>

      <div className="flex flex-col flex-1 p-5">
        <h3 className="font-semibold text-foreground leading-tight line-clamp-1 mb-2">{property.name}</h3>

        <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground mb-4">
          {property.propertyType && <span className="capitalize font-medium">{property.propertyType}</span>}
          {property.bedrooms != null && <span className="flex items-center gap-1.5"><BedDouble className="h-4 w-4" />{property.bedrooms} bed{property.bedrooms !== 1 ? 's' : ''}</span>}
          {property.bathrooms != null && <span className="flex items-center gap-1.5"><Bath className="h-4 w-4" />{property.bathrooms} bath{property.bathrooms !== 1 ? 's' : ''}</span>}
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
