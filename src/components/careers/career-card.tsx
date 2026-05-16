import Link from "next/link"
import { MapPin, Briefcase, Wifi } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import ImageSwiper from "@/components/ImageSwiper"

export default function CareerCard({ item, locked }: { item: any; locked?: boolean }) {
  const images: string[] = item.images ?? []

  return (
      <Link
          href={item.detailUrl}
          className="group block border rounded-lg overflow-hidden hover:border-primary hover:shadow-sm transition-all"
      >
        {images.length > 0 ? (
            <ImageSwiper
                images={images}
                alt={item.jobTitle}
                height="h-36"
                overlay={
                  locked ? (
                      <div className="absolute inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center">
                        <span className="text-xs font-medium text-muted-foreground">Requires JOBSEEKER role</span>
                      </div>
                  ) : undefined
                }
            />
        ) : (
            <div className="h-20 w-full bg-primary/5 flex items-center justify-center border-b">
          <span className="text-3xl font-bold text-primary/30">
            {item.company?.[0]?.toUpperCase() ?? "?"}
          </span>
            </div>
        )}

        <div className="p-3 space-y-1.5">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-sm leading-tight line-clamp-1">{item.jobTitle}</h3>
            {item.remote && (
                <Badge variant="secondary" className="shrink-0 text-[10px] gap-1">
                  <Wifi className="h-2.5 w-2.5" /> Remote
                </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground font-medium">{item.company}</p>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3 shrink-0" />
            <span className="truncate">{item.location}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Briefcase className="h-3 w-3 shrink-0" />
            <span>{item.employmentType}</span>
          </div>
          <p className="text-xs font-semibold text-primary">
            {item.currency} {Number(item.salaryMin).toLocaleString()} –{" "}
            {Number(item.salaryMax).toLocaleString()}
          </p>
          {locked && images.length === 0 && (
              <p className="text-[11px] text-muted-foreground border rounded px-2 py-1 text-center">
                Requires JOBSEEKER role to view details
              </p>
          )}
        </div>
      </Link>
  )
}