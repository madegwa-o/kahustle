import Link from "next/link"
import { Calendar, Clock, Hammer, MapPin } from "lucide-react"
import { ConstructionListing } from "@/lib/construction-freelancers/types"
import { formatConstructionValue, formatCurrency, formatExperience, formatPostedDate } from "@/lib/construction-freelancers/construction-formatters"

export default function ConstructionServiceCard({ service }: { service: ConstructionListing }) {
  const primaryArea = service.serviceArea?.[0]

  return (
    <Link
      href={service.detailUrl}
      className="group flex flex-col rounded-xl border border-border bg-card overflow-hidden hover:border-primary/40 hover:shadow-md transition-all duration-200"
    >
      <div className="relative h-48 overflow-hidden bg-muted">
        {service.image ? (
          <img src={service.image} alt={service.name ?? "Construction service"} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-muted-foreground"><Hammer className="h-12 w-12 opacity-20" /></div>
        )}
        <div className="absolute top-2.5 left-2.5 flex gap-1.5">
          {service.availability && (
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">
              {formatConstructionValue(service.availability)}
            </span>
          )}
          {service.status === "inactive" && (
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">Inactive</span>
          )}
        </div>
      </div>

      <div className="flex flex-col flex-1 p-4">
        <h3 className="font-semibold text-foreground leading-snug line-clamp-1 mb-1">{service.name}</h3>

        <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground mb-3">
          {service.category && <span className="capitalize flex items-center gap-1"><Hammer className="h-3 w-3" />{service.category}</span>}
          {service.yearsOfExperience != null && <span>{formatExperience(service.yearsOfExperience)}</span>}
          {service.availability && <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{formatConstructionValue(service.availability)}</span>}
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
