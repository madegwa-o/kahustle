import { ConstructionDetail } from "@/lib/construction-freelancers/types"
import { formatConstructionValue, formatExperience } from "@/lib/construction-freelancers/construction-formatters"

export default function ConstructionServiceSpecs({ service }: { service: ConstructionDetail }) {
  const specs: [string, string | undefined][] = [
    ["Category", service.category],
    ["Experience", formatExperience(service.yearsOfExperience)],
    ["Availability", formatConstructionValue(service.availability)],
    ["Price type", formatConstructionValue(service.priceType)],
    ["Licensed", service.license ? service.license : undefined],
    ["Insured", service.insurance == null ? undefined : service.insurance ? "Yes" : "No"],
    ["Previous projects", service.previousProjects?.toString()],
  ]

  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="px-4 py-3 border-b border-border">
        <h2 className="font-semibold text-foreground">Service details</h2>
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
