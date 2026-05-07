import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { MapPin, Phone, Mail, User, Clock, Eye, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { connectToDatabase } from "@/lib/db"
import { Product } from "@/models/Product"
import { User as UserModel } from "@/models/User"
import type { Metadata } from "next"
import { Types } from "mongoose"

async function getProductData(id: string) {
    try {
        if (!Types.ObjectId.isValid(id)) {
            return null
        }

        await connectToDatabase()

        const product = await Product.findByIdAndUpdate(
            id,
            { $inc: { views: 1 } },
            { new: true }
        ).populate("userId", "name email phone image address")

        if (!product) {
            return null
        }

        const related = await Product.find({
            category: product.category,
            _id: { $ne: product._id },
            status: "active",
        })
            .limit(6)
            .lean()

        return {
            product: JSON.parse(JSON.stringify(product)),
            related: JSON.parse(JSON.stringify(related)),
        }
    } catch (error) {
        console.error("Error fetching product:", error)
        return null
    }
}

export async function generateMetadata(
    { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
    const { id } = await params
    const data = await getProductData(id)

    if (!data?.product) {
        return {
            title: "Product Not Found",
            description: "The product you're looking for doesn't exist.",
        }
    }

    return {
        title: `${data.product.name} | Kahustle`,
        description: data.product.description || `Buy ${data.product.name} on Kahustle`,
        openGraph: {
            title: data.product.name,
            description: data.product.description,
            images: data.product.images[0] ? [{ url: data.product.images[0] }] : [],
        },
    }
}

export default async function ProductPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const data = await getProductData(id)

    if (!data) {
        notFound()
    }

    const { product, related } = data
    const seller = product.userId

    return (
        <main className="container mx-auto px-4 py-8 max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Product Images & Details */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Image Gallery */}
                    <Card>
                        <CardContent className="pt-6">
                            {product.images.length > 0 ? (
                                <div className="relative w-full bg-muted rounded-lg overflow-hidden">
                                    <div className="relative w-full pb-[100%]">
                                        <Image
                                            src={product.images[0]}
                                            alt={product.name}
                                            fill
                                            className="object-contain"
                                            priority
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="w-full h-96 bg-muted rounded-lg flex items-center justify-center">
                                    <p className="text-muted-foreground">No image available</p>
                                </div>
                            )}

                            {product.images.length > 1 && (
                                <div className="grid grid-cols-4 gap-2 mt-4">
                                    {product.images.map((img: string, idx: number) => (
                                        <div
                                            key={idx}
                                            className="relative w-full h-20 bg-muted rounded-lg overflow-hidden border-2 border-border cursor-pointer hover:border-primary transition-colors"
                                        >
                                            <Image
                                                src={img}
                                                alt={`${product.name} ${idx + 1}`}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Product Details */}
                    <Card>
                        <CardHeader>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="inline-block px-2 py-1 bg-primary/10 text-primary rounded text-xs font-semibold">
                                        {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                                    </span>
                                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                                        <Eye className="h-4 w-4" />
                                        {product.views} views
                                    </span>
                                </div>
                                <h1 className="text-3xl font-bold">{product.name}</h1>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl font-bold text-primary">
                                        KES {product.price.toLocaleString()}
                                    </span>
                                    <span className={`text-sm font-medium px-2 py-1 rounded ${
                                        product.status === "active"
                                            ? "bg-primary/10 text-primary"
                                            : "bg-muted text-muted-foreground"
                                    }`}>
                                        {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                                    </span>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Clock className="h-4 w-4" />
                                Posted {new Date(product.createdAt).toLocaleDateString("en-KE", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })}
                            </div>

                            {product.description && (
                                <div>
                                    <h3 className="font-semibold mb-2">Description</h3>
                                    <p className="text-foreground whitespace-pre-wrap">
                                        {product.description}
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar - Seller Info */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Seller Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-3">
                                {seller.image ? (
                                    <div className="relative w-12 h-12 rounded-full overflow-hidden">
                                        <Image
                                            src={seller.image}
                                            alt={seller.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                ) : (
                                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                        <User className="h-6 w-6 text-primary" />
                                    </div>
                                )}
                                <div>
                                    <h4 className="font-semibold">{seller.name}</h4>
                                    <p className="text-xs text-muted-foreground">Seller</p>
                                </div>
                            </div>

                            <div className="space-y-2 pt-4 border-t">
                                {seller.email && (
                                    <a
                                        href={`mailto:${seller.email}`}
                                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary transition-colors"
                                    >
                                        <Mail className="h-5 w-5 text-primary flex-shrink-0" />
                                        <span className="text-sm truncate">{seller.email}</span>
                                    </a>
                                )}

                                {seller.phone && (
                                    <a
                                        href={`tel:${seller.phone}`}
                                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary transition-colors"
                                    >
                                        <Phone className="h-5 w-5 text-primary flex-shrink-0" />
                                        <span className="text-sm">{seller.phone}</span>
                                    </a>
                                )}

                                {seller.address && (
                                    <div className="flex items-start gap-3 p-2">
                                        <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                                        <span className="text-sm">{seller.address}</span>
                                    </div>
                                )}
                            </div>

                            <div className="pt-4 border-t space-y-2">
                                <Button className="w-full" asChild>
                                    <a href={`mailto:${seller.email}`}>
                                        Send Message
                                    </a>
                                </Button>
                                <Button variant="outline" className="w-full" asChild>
                                    <a href={`tel:${seller.phone || "tel:unavailable"}`}>
                                        {seller.phone ? "Call Seller" : "Contact"}
                                    </a>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <Button variant="outline" className="w-full gap-2">
                                <Share2 className="h-4 w-4" />
                                Share Listing
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Related Products */}
            {related.length > 0 && (
                <div className="mt-16 space-y-6">
                    <div>
                        <h2 className="text-2xl font-bold">Related Products</h2>
                        <p className="text-muted-foreground">
                            Other listings in {product.category}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {related.map((item: any) => (
                            <Link key={item._id} href={`/product/${item._id}`}>
                                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                                    <div className="relative w-full h-48 bg-muted overflow-hidden rounded-t-lg">
                                        {item.images.length > 0 ? (
                                            <Image
                                                src={item.images[0]}
                                                alt={item.name}
                                                fill
                                                className="object-cover hover:scale-105 transition-transform"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-muted">
                                                <p className="text-muted-foreground text-sm">No image</p>
                                            </div>
                                        )}
                                    </div>
                                    <CardContent className="pt-4 space-y-2">
                                        <h3 className="font-semibold line-clamp-2">
                                            {item.name}
                                        </h3>
                                        <p className="text-primary font-bold text-lg">
                                            KES {item.price.toLocaleString()}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {item.views} views
                                        </p>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </main>
    )
}
