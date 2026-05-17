import { ConstructionDetail as ConstructionDetailType } from "@/lib/construction-freelancers/types"
import { formatConstructionValue, formatCurrency, formatPostedDate } from "@/lib/construction-freelancers/construction-formatters"
import { Calendar, Eye, MapPin } from "lucide-react"
import ConstructionServiceGallery from "./construction-service-gallery"
import ConstructionServiceSpecs from "./construction-service-specs"
import ConstructionServiceSeller from "./construction-service-seller"
import ConstructionServicesGrid from "./construction-services-grid"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"

interface Props {
  service: ConstructionDetailType
  canViewFreelancerContact: boolean
}

export default function ConstructionServiceDetail({ service, canViewFreelancerContact }: Props) {
  return (
    <div className="space-y-6">
      <Link href="/construction-freelancers" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors">
        <ChevronLeft className="h-4 w-4" />Back to construction freelancers
      </Link>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-5">
          <ConstructionServiceGallery images={service.images ?? []} />

          <div>
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h1 className="text-2xl font-bold text-foreground leading-tight">{service.name}</h1>
                <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                  {!!service.serviceArea?.length && <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{service.serviceArea.join(", ")}</span>}
                  {service.createdAt && <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{formatPostedDate(service.createdAt)}</span>}
                  {service.views != null && <span className="flex items-center gap-1"><Eye className="h-3.5 w-3.5" />{service.views.toLocaleString()} views</span>}
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-foreground">{formatCurrency(service.price ?? 0, service.currency)}</p>
                {service.priceType && (
                  <span className="mt-1 inline-block text-xs font-semibold px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">
                    {formatConstructionValue(service.priceType)}
                  </span>
                )}
              </div>
            </div>
          </div>

          <ConstructionServiceSpecs service={service} />

          {!!service.skills?.length && (
            <div className="rounded-xl border border-border bg-card">
              <div className="px-4 py-3 border-b border-border">
                <h2 className="font-semibold text-foreground">Skills and expertise</h2>
              </div>
              <div className="flex flex-wrap gap-2 p-4">
                {service.skills.map((skill) => (
                  <span key={skill} className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">{skill}</span>
                ))}
              </div>
            </div>
          )}

          {!!service.certifications?.length && (
            <div className="rounded-xl border border-border bg-card">
              <div className="px-4 py-3 border-b border-border">
                <h2 className="font-semibold text-foreground">Certifications</h2>
              </div>
              <div className="flex flex-wrap gap-2 p-4">
                {service.certifications.map((certification) => (
                  <span key={certification} className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">{certification}</span>
                ))}
              </div>
            </div>
          )}

          {service.description && (
            <div className="rounded-xl border border-border bg-card">
              <div className="px-4 py-3 border-b border-border">
                <h2 className="font-semibold text-foreground">Description</h2>
              </div>
              <p className="px-4 py-4 text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{service.description}</p>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <ConstructionServiceSeller freelancer={service.freelancer} canView={canViewFreelancerContact} />
        </div>
      </div>

      {!!service.relatedFreelancers?.length && (
        <div className="pt-4 border-t border-border">
          <h2 className="mb-4 text-xl font-semibold text-foreground">Similar construction freelancers</h2>
          <ConstructionServicesGrid services={service.relatedFreelancers} />
        </div>
      )}
    </div>
  )
}
