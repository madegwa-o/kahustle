import { VehicleDetail } from "@/lib/vehicles/types"
import { formatMileage } from "@/lib/vehicles/vehicle-formatters"

export default function ConstructionServiceSpecs({ vehicle }: { vehicle: VehicleDetail }) {
  const specs: [string, string | undefined][] = [
    ["Year", vehicle.year?.toString()],
    ["Mileage", formatMileage(vehicle.mileage)],
    ["Fuel type", vehicle.fuelType],
    ["Transmission", vehicle.transmission],
    ["Body type", vehicle.bodyType],
    ["Colour", vehicle.color],
    ["Condition", vehicle.condition],
    ["VIN", vehicle.vin ?? undefined],
  ]

  return (
      <div className="rounded-xl border border-border bg-card">
        <div className="px-4 py-3 border-b border-border">
          <h2 className="font-semibold text-foreground">Specifications</h2>
        </div>
        <dl className="divide-y divide-border">
          {specs.filter(([, v]) => v).map(([label, value]) => (
              <div key={label} className="flex items-center justify-between px-4 py-2.5">
                <dt className="text-sm text-muted-foreground">{label}</dt>
                <dd className="text-sm font-medium text-foreground capitalize">{value}</dd>
              </div>
          ))}
        </dl>
      </div>
  )
}