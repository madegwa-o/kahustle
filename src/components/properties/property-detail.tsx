import { PropertyDetail as PropertyDetailType } from "@/lib/properties/types"
import { formatCurrency, formatPostedDate, formatPropertyCondition } from "@/lib/properties/property-formatters"
import { MapPin, Eye, Calendar } from "lucide-react"
import PropertyGallery from "./property-gallery"
import PropertySpecs from "./property-specs"
import PropertySeller from "./property-seller"
import PropertiesGrid from "./properties-grid"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"

interface Props {
  property: PropertyDetailType
  canViewSellerContact: boolean
}

export default function PropertyDetail({ property, canViewSellerContact }: Props) {
  return (
    <div className="space-y-6">
      <Link href="/properties" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors">
        <ChevronLeft className="h-4 w-4" />Back to properties
      </Link>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-5">
          <PropertyGallery images={property.images ?? []} />

          <div>
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h1 className="text-2xl font-bold text-foreground leading-tight">{property.name}</h1>
                <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                  {property.city && <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{property.city}</span>}
                  {property.createdAt && <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{formatPostedDate(property.createdAt)}</span>}
                  {property.views != null && <span className="flex items-center gap-1"><Eye className="h-3.5 w-3.5" />{property.views.toLocaleString()} views</span>}
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-foreground">{formatCurrency(property.price ?? 0, property.currency)}</p>
                {property.condition && (
                  <span className="mt-1 inline-block text-xs font-semibold px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">
                    {formatPropertyCondition(property.condition)}
                  </span>
                )}
              </div>
            </div>
          </div>

          <PropertySpecs property={property} />

          {!!property.amenities?.length && (
            <div className="rounded-xl border border-border bg-card">
              <div className="px-4 py-3 border-b border-border">
                <h2 className="font-semibold text-foreground">Amenities</h2>
              </div>
              <div className="flex flex-wrap gap-2 p-4">
                {property.amenities.map((amenity) => (
                  <span key={amenity} className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">{amenity}</span>
                ))}
              </div>
            </div>
          )}

          {property.description && (
            <div className="rounded-xl border border-border bg-card">
              <div className="px-4 py-3 border-b border-border">
                <h2 className="font-semibold text-foreground">Description</h2>
              </div>
              <p className="px-4 py-4 text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{property.description}</p>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <PropertySeller seller={property.seller} canView={canViewSellerContact} />
        </div>
      </div>

      {!!property.relatedProperties?.length && (
        <div className="pt-4 border-t border-border">
          <h2 className="mb-4 text-xl font-semibold text-foreground">Similar properties</h2>
          <PropertiesGrid properties={property.relatedProperties} />
        </div>
      )}
    </div>
  )
}
