import Link from "next/link"
import { Calendar, Clock, Hammer, MapPin } from "lucide-react"
import { ConstructionListing } from "@/lib/construction-freelancers/types"
import { formatConstructionValue, formatCurrency, formatExperience, formatPostedDate } from "@/lib/construction-freelancers/construction-formatters"

export default function ConstructionServiceCard({ service }: { service: ConstructionListing }) {
  const primaryArea = service.serviceArea?.[0]

  return (
    <Link
      href={service.detailUrl}
      className="group flex flex-col rounded-lg border border-border bg-card overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
    >
      <div className="relative h-48 overflow-hidden bg-muted">
        {service.image ? (
          <img src={service.image} alt={service.name ?? "Construction service"} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-muted-foreground"><Hammer className="h-12 w-12 opacity-20" /></div>
        )}
        <div className="absolute top-3 left-3 flex gap-2">
          {service.availability && (
            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-primary/10 text-primary">
              {formatConstructionValue(service.availability)}
            </span>
          )}
          {service.status === "inactive" && (
            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-amber-100 text-amber-800">Inactive</span>
          )}
        </div>
      </div>

      <div className="flex flex-col flex-1 p-5">
        <h3 className="font-semibold text-foreground leading-tight line-clamp-1 mb-2">{service.name}</h3>

        <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground mb-4">
          {service.category && <span className="capitalize flex items-center gap-1.5"><Hammer className="h-4 w-4" />{service.category}</span>}
          {service.yearsOfExperience != null && <span className="font-medium">{formatExperience(service.yearsOfExperience)}</span>}
          {service.availability && <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" />{formatConstructionValue(service.availability)}</span>}
        </div>

        <div className="mt-auto flex items-end justify-between">
          <div>
            <p className="text-lg font-bold text-foreground">{formatCurrency(service.price ?? 0, service.currency)}</p>
            {service.createdAt && (
              <p className="flex items-center gap-1 text-xs text-muted-foreground"><Calendar className="h-3 w-3" />{formatPostedDate(service.createdAt)}</p>
            )}
          </div>
          {primaryArea && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />{primaryArea}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
