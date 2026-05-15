import { notFound } from "next/navigation"
import { getServerSession } from "next-auth"
import Image from "next/image"
import { Eye, Clock, Mail, MapPin, Phone, User, Lock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MainCategory } from "@/lib/categories"
import { canViewListingDetails } from "@/lib/permissions"
import { connectToDatabase } from "@/lib/db"
import { Model, Types } from "mongoose"

interface DetailConfig {
  category: string
  listingLabel: string
  model: Model<unknown>
  callbackPrefix: string
  categoryKey: MainCategory
  requiredViewRoleLabel: string
  details: (item: Record<string, unknown>) => Array<{ label: string; value: string }>
}

interface ProductDoc extends Record<string, unknown> {
  name: string
  price: number
  views: number
  createdAt: string | Date
  status: string
  description?: string
  images?: string[]
  userId?: Record<string, string | undefined>
}

export default async function SpecializedProductDetailPage({
  id,
  config,
}: {
  id: string
  config: DetailConfig
}) {
  if (!Types.ObjectId.isValid(id)) {
    notFound()
  }

  const session = await getServerSession()
  const canView = canViewListingDetails(session?.user, config.categoryKey)

  if (!session?.user?.email || !canView) {
    return (
      <main className="container mx-auto max-w-3xl px-4 py-16">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Lock className="h-5 w-5" />Role-gated listing access</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>This listing requires a {config.requiredViewRoleLabel} role to access full details.</p>
            <div className="flex gap-3">
              <Button asChild><a href="/account">Add {config.requiredViewRoleLabel} Role</a></Button>
              <Button variant="outline" asChild><a href="/account">Go to Account Roles</a></Button>
            </div>
          </CardContent>
        </Card>
      </main>
    )
  }

  await connectToDatabase()

  const product = await config.model
    .findByIdAndUpdate(id, { $inc: { views: 1 } }, { new: true })
    .populate("userId", "name email phone image address")
    .lean<ProductDoc | null>()

  if (!product || product.status !== "active") {
    notFound()
  }

  const seller = product.userId ?? {}

  return (
    <main className="container mx-auto max-w-5xl px-4 py-8">
      <div className="grid gap-6 lg:grid-cols-3">
        <section className="space-y-6 lg:col-span-2">
          <Card>
            <CardContent className="pt-6">
              <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-muted">
                {product.images?.[0] ? (
                  <Image src={product.images[0]} alt={product.name} fill className="object-cover" priority />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-muted-foreground">No image</div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="space-y-4 pt-6">
              <h1 className="text-3xl font-bold">{product.name}</h1>
              <p className="text-2xl font-semibold text-primary">KES {product.price.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground flex items-center gap-2"><Eye className="h-4 w-4" />{product.views} views</p>
              <p className="text-sm text-muted-foreground flex items-center gap-2"><Clock className="h-4 w-4" />Posted {new Date(product.createdAt).toLocaleDateString()}</p>

              {product.description ? <p className="whitespace-pre-wrap text-sm">{product.description}</p> : null}

              <div className="grid gap-3 rounded-lg border p-4 sm:grid-cols-2">
                {config.details(product).map((item) => (
                  <div key={item.label}>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">{item.label}</p>
                    <p className="text-sm font-medium">{item.value}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        <aside className="space-y-6">
          <Card>
            <CardHeader><CardTitle>{config.listingLabel} Owner</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2"><User className="h-4 w-4" /><span>{seller?.name || "Seller"}</span></div>
              {seller?.email ? <a href={`mailto:${seller.email}`} className="flex items-center gap-2 text-sm hover:underline"><Mail className="h-4 w-4" />{seller.email}</a> : null}
              {seller?.phone ? <a href={`tel:${seller.phone}`} className="flex items-center gap-2 text-sm hover:underline"><Phone className="h-4 w-4" />{seller.phone}</a> : null}
              {seller?.address ? <p className="flex items-center gap-2 text-sm"><MapPin className="h-4 w-4" />{seller.address}</p> : null}
              <Button className="w-full" asChild><a href={`mailto:${seller?.email || ""}`}>Contact</a></Button>
            </CardContent>
          </Card>
        </aside>
      </div>
    </main>
  )
}
