import { VehicleDetail } from "@/lib/vehicles/types"
import { Mail, Phone, MapPin, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface Props {
  seller: VehicleDetail["seller"]
  canView: boolean
}

export default function ConstructionServiceSeller({ seller, canView }: Props) {
  if (!seller) return null

  return (
      <div className="rounded-xl border border-border bg-card">
        <div className="px-4 py-3 border-b border-border">
          <h2 className="font-semibold text-foreground">Seller information</h2>
        </div>
        <div className="p-4 space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-sm">
              {seller.name?.charAt(0).toUpperCase() ?? "?"}
            </div>
            <div>
              <p className="font-medium text-foreground">{seller.name ?? "Unknown seller"}</p>
              {seller.location && (
                  <p className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" />{seller.location}
                  </p>
              )}
            </div>
          </div>

          {canView ? (
              <div className="space-y-2 pt-1">
                {seller.email && (
                    <a href={`mailto:${seller.email}`} className="flex items-center gap-2 text-sm text-foreground hover:text-primary transition-colors">
                      <Mail className="h-4 w-4 text-muted-foreground" />{seller.email}
                    </a>
                )}
                {seller.phone && (
                    <a href={`tel:${seller.phone}`} className="flex items-center gap-2 text-sm text-foreground hover:text-primary transition-colors">
                      <Phone className="h-4 w-4 text-muted-foreground" />{seller.phone}
                    </a>
                )}
              </div>
          ) : (
              <div className="flex items-start gap-3 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 p-3 text-sm">
                <Lock className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-amber-800 dark:text-amber-400">Contact details hidden</p>
                  <p className="text-amber-700 dark:text-amber-500 text-xs mt-0.5">You need the <strong>Car Buyer</strong> role to view seller contact details.</p>
                  <Button size="sm" variant="outline" className="mt-2 h-7 text-xs border-amber-300" asChild>
                    <Link href="/account">Upgrade account</Link>
                  </Button>
                </div>
              </div>
          )}
        </div>
      </div>
  )
}