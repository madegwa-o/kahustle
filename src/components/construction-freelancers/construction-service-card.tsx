import Link from "next/link"
import { MapPin, Fuel, Gauge, Calendar } from "lucide-react"
import { VehicleListing } from "@/lib/vehicles/types"
import { formatCurrency, formatMileage, formatPostedDate, formatCondition } from "@/lib/vehicles/vehicle-formatters"

export default function ConstructionServiceCard({ vehicle }: { vehicle: VehicleListing }) {
    return (
        <Link
            href={vehicle.detailUrl}
            className="group flex flex-col rounded-xl border border-border bg-card overflow-hidden hover:border-primary/40 hover:shadow-md transition-all duration-200"
        >
            <div className="relative h-48 overflow-hidden bg-muted">
                {vehicle.image
                    ? <img src={vehicle.image} alt={vehicle.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    : <div className="h-full w-full flex items-center justify-center text-muted-foreground"><Gauge className="h-12 w-12 opacity-20" /></div>
                }
                <div className="absolute top-2.5 left-2.5 flex gap-1.5">
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${vehicle.condition === "new" ? "bg-green-100 text-green-800" : "bg-secondary text-secondary-foreground"}`}>
            {formatCondition(vehicle.condition)}
          </span>
                    {vehicle.status === "inactive" && (
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">Inactive</span>
                    )}
                </div>
            </div>

            <div className="flex flex-col flex-1 p-4">
                <h3 className="font-semibold text-foreground leading-snug line-clamp-1 mb-1">{vehicle.name}</h3>

                <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground mb-3">
                    {vehicle.fuelType && (
                        <span className="flex items-center gap-1"><Fuel className="h-3 w-3" />{vehicle.fuelType}</span>
                    )}
                    {vehicle.mileage != null && (
                        <span className="flex items-center gap-1"><Gauge className="h-3 w-3" />{formatMileage(vehicle.mileage)}</span>
                    )}
                    {vehicle.transmission && (
                        <span className="capitalize">{vehicle.transmission}</span>
                    )}
                </div>

                <div className="mt-auto flex items-end justify-between">
                    <div>
                        <p className="text-lg font-bold text-foreground">{formatCurrency(vehicle.price ?? 0, vehicle.currency)}</p>
                        {vehicle.createdAt && (
                            <p className="text-xs text-muted-foreground">{formatPostedDate(vehicle.createdAt)}</p>
                        )}
                    </div>
                    {vehicle.location && (
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />{vehicle.location}
            </span>
                    )}
                </div>
            </div>
        </Link>
    )
}