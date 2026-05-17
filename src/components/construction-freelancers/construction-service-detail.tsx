import { VehicleDetail as VehicleDetailType } from "@/lib/vehicles/types"
import { formatCurrency, formatPostedDate } from "@/lib/vehicles/vehicle-formatters"
import { MapPin, Eye, Calendar } from "lucide-react"
import ConstructionServiceGallery from "./construction-service-gallery"
import ConstructionServiceSpecs from "./construction-service-specs"
import ConstructionServiceSeller from "./construction-service-seller"
import ConstructionServicesGrid from "./construction-services-grid"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"

interface Props {
  vehicle: VehicleDetailType
  canViewSellerContact: boolean
}

export default function ConstructionServiceDetail({ vehicle, canViewSellerContact }: Props) {
  return (
      <div className="space-y-6">
        <Link href="/vehicles" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors">
          <ChevronLeft className="h-4 w-4" />Back to vehicles
        </Link>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-5">
            <ConstructionServiceGallery images={vehicle.images ?? []} />

            <div>
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <h1 className="text-2xl font-bold text-foreground leading-tight">{vehicle.name}</h1>
                  <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                    {vehicle.location && <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{vehicle.location}</span>}
                    {vehicle.createdAt && <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{formatPostedDate(vehicle.createdAt)}</span>}
                    {vehicle.views != null && <span className="flex items-center gap-1"><Eye className="h-3.5 w-3.5" />{vehicle.views.toLocaleString()} views</span>}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-foreground">{formatCurrency(vehicle.price ?? 0, vehicle.currency)}</p>
                  {vehicle.condition && (
                      <span className={`mt-1 inline-block text-xs font-semibold px-2 py-0.5 rounded-full ${vehicle.condition === "new" ? "bg-green-100 text-green-800" : "bg-secondary text-secondary-foreground"}`}>
                    {vehicle.condition}
                  </span>
                  )}
                </div>
              </div>
            </div>

            <ConstructionServiceSpecs vehicle={vehicle} />

            {vehicle.description && (
                <div className="rounded-xl border border-border bg-card">
                  <div className="px-4 py-3 border-b border-border">
                    <h2 className="font-semibold text-foreground">Description</h2>
                  </div>
                  <p className="px-4 py-4 text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{vehicle.description}</p>
                </div>
            )}
          </div>

          {/* Right column */}
          <div className="space-y-4">
            <ConstructionServiceSeller seller={vehicle.seller} canView={canViewSellerContact} />
          </div>
        </div>

        {!!vehicle.relatedVehicles?.length && (
            <div className="pt-4 border-t border-border">
              <h2 className="mb-4 text-xl font-semibold text-foreground">Similar vehicles</h2>
              <ConstructionServicesGrid vehicles={vehicle.relatedVehicles} />
            </div>
        )}
      </div>
  )
}