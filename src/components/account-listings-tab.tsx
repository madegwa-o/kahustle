"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Plus, Edit2, Trash2, Loader2, Eye, Upload, X, ImagePlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import Link from "next/link"
import type { IProduct } from "@/models/Product"

interface Product extends Omit<IProduct, "_id" | "userId"> {
    _id: string
    userId: string
}

export default function AccountListingsTab() {
    const { data: session } = useSession()
    const [products, setProducts] = useState<Product[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isCreating, setIsCreating] = useState(false)
    const [openDialog, setOpenDialog] = useState(false)
    const [editingProduct, setEditingProduct] = useState<Product | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)
    const [uploadingImages, setUploadingImages] = useState(false)

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        category: "",
        images: [] as string[],
    })

    const categories = [
        "Cars",
        "Motorbikes & Scooters",
        "Trucks, Vans & Buses",
        "Auto Parts & Accessories",
        "Bicycles & 3 Wheelers",
        "Apartments & Flats",
        "Houses",
        "Commercial Property",
        "Plots & Land",
        "Local Jobs",
        "Plumber",
        "Building Construction",
        "Electrician",
        "Masonry",
        "Carpentry",
    ]

    // Fetch user's products
    useEffect(() => {
        const fetchProducts = async () => {
            if (!session?.user) return

            try {
                const response = await fetch(`/api/products?userId=${session.user.id}`)
                const data = await response.json()

                if (data.success) {
                    setProducts(data.products)
                } else {
                    setError("Failed to load your products")
                }
            } catch (err) {
                console.error("Error fetching products:", err)
                setError("Failed to load your products")
            } finally {
                setIsLoading(false)
            }
        }

        fetchProducts()
    }, [session?.user])

    const handleOpenDialog = (product?: Product) => {
        if (product) {
            setEditingProduct(product)
            setFormData({
                name: product.name,
                description: product.description,
                price: product.price.toString(),
                category: product.category,
                images: product.images,
            })
        } else {
            setEditingProduct(null)
            setFormData({
                name: "",
                description: "",
                price: "",
                category: "",
                images: [],
            })
        }
        setOpenDialog(true)
        setError(null)
        setSuccess(null)
    }

    const handleCloseDialog = () => {
        setOpenDialog(false)
        setEditingProduct(null)
    }

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files) return

        // Check max 3 images
        if (formData.images.length + files.length > 3) {
            setError(`Maximum 3 images allowed. You have ${formData.images.length} already.`)
            return
        }

        setUploadingImages(true)
        setError(null)

        try {
            const newImages: string[] = []

            for (const file of Array.from(files)) {
                const formDataUpload = new FormData()
                formDataUpload.append("file", file)

                const response = await fetch("/api/upload", {
                    method: "POST",
                    body: formDataUpload,
                })

                const data = await response.json()

                if (!response.ok) {
                    throw new Error(data.error || "Upload failed")
                }

                newImages.push(data.url)
            }

            setFormData({
                ...formData,
                images: [...formData.images, ...newImages],
            })
            setSuccess(`${newImages.length} image(s) uploaded successfully!`)
        } catch (err) {
            console.error("Error uploading images:", err)
            setError(err instanceof Error ? err.message : "Failed to upload images")
        } finally {
            setUploadingImages(false)
            // Reset file input
            if (e.target) {
                e.target.value = ""
            }
        }
    }

    const removeImage = (index: number) => {
        setFormData({
            ...formData,
            images: formData.images.filter((_, i) => i !== index),
        })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setSuccess(null)

        if (!formData.name.trim() || !formData.price || !formData.category) {
            setError("Please fill in all required fields")
            return
        }

        setIsCreating(true)

        try {
            const url = editingProduct
                ? `/api/products/${editingProduct._id}`
                : "/api/products"

            const method = editingProduct ? "PUT" : "POST"

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.name.trim(),
                    description: formData.description.trim(),
                    price: parseFloat(formData.price),
                    category: formData.category,
                    images: formData.images,
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                setError(data.error || "Failed to save product")
                return
            }

            if (editingProduct) {
                // Update the product in the list
                setProducts(
                    products.map((p) =>
                        p._id === editingProduct._id ? { ...p, ...data.product } : p
                    )
                )
                setSuccess("Product updated successfully!")
            } else {
                // Add new product to the list
                setProducts([data.product, ...products])
                setSuccess("Product created successfully!")
            }

            setTimeout(() => {
                handleCloseDialog()
                setSuccess(null)
            }, 1500)
        } catch (err) {
            console.error("Error saving product:", err)
            setError("Failed to save product")
        } finally {
            setIsCreating(false)
        }
    }

    const handleDelete = async (productId: string) => {
        if (!window.confirm("Are you sure you want to delete this product?")) {
            return
        }

        try {
            const response = await fetch(`/api/products/${productId}`, {
                method: "DELETE",
            })

            const data = await response.json()

            if (!response.ok) {
                setError(data.error || "Failed to delete product")
                return
            }

            setProducts(products.filter((p) => p._id !== productId))
            setSuccess("Product deleted successfully!")
            setTimeout(() => setSuccess(null), 2000)
        } catch (err) {
            console.error("Error deleting product:", err)
            setError("Failed to delete product")
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {error && (
                <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {success && (
                <Alert className="border-primary bg-primary/10">
                    <AlertDescription className="text-primary">{success}</AlertDescription>
                </Alert>
            )}

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <ImagePlus className="h-5 w-5" />
                            My Listings
                        </CardTitle>
                        <CardDescription>
                            Manage your product listings and view their performance
                        </CardDescription>
                    </div>
                    <Button
                        onClick={() => handleOpenDialog()}
                        className="gap-2"
                    >
                        <Plus className="h-4 w-4" />
                        New Listing
                    </Button>
                </CardHeader>

                {products.length === 0 ? (
                    <CardContent>
                        <div className="text-center py-12">
                            <p className="text-muted-foreground mb-4">
                                You haven&apos;t created any listings yet
                            </p>
                            <Button
                                onClick={() => handleOpenDialog()}
                                className="gap-2"
                            >
                                <Plus className="h-4 w-4" />
                                Create Your First Listing
                            </Button>
                        </div>
                    </CardContent>
                ) : (
                    <CardContent>
                        <div className="space-y-3">
                            {products.map((product) => (
                                <div
                                    key={product._id}
                                    className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                                >
                                    {product.images.length > 0 && (
                                        <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                                            <Image
                                                src={product.images[0]}
                                                alt={product.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    )}

                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-semibold text-sm truncate">
                                            {product.name}
                                        </h4>
                                        <p className="text-xs text-muted-foreground">
                                            {product.category}
                                        </p>
                                        <div className="flex items-center gap-2 mt-1 text-xs">
                                            <span className="text-primary font-semibold">
                                                KES {product.price.toLocaleString()}
                                            </span>
                                            <span className="text-muted-foreground flex items-center gap-1">
                                                <Eye className="h-3 w-3" />
                                                {product.views} views
                                            </span>
                                            <span className="text-muted-foreground flex items-center gap-1">
                                                📸 {product.images.length}/3
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                                            product.status === "active"
                                                ? "bg-primary/10 text-primary"
                                                : "bg-muted text-muted-foreground"
                                        }`}>
                                            {product.status}
                                        </span>

                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            asChild
                                        >
                                            <Link href={`/product/${product._id}`}>
                                                View
                                            </Link>
                                        </Button>

                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleOpenDialog(product)}
                                        >
                                            <Edit2 className="h-4 w-4" />
                                        </Button>

                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleDelete(product._id)}
                                        >
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                )}
            </Card>

            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>
                            {editingProduct ? "Edit Listing" : "Create New Listing"}
                        </DialogTitle>
                        <DialogDescription>
                            {editingProduct
                                ? "Update your product listing details"
                                : "Add a new product to sell"}
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label htmlFor="name">Product Name *</Label>
                            <Input
                                id="name"
                                placeholder="e.g., iPhone 15 Pro Max"
                                value={formData.name}
                                onChange={(e) =>
                                    setFormData({ ...formData, name: e.target.value })
                                }
                                disabled={isCreating}
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="description">Description</Label>
                            <Input
                                id="description"
                                placeholder="Describe your product..."
                                value={formData.description}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        description: e.target.value,
                                    })
                                }
                                disabled={isCreating}
                            />
                        </div>

                        <div>
                            <Label htmlFor="price">Price (KES) *</Label>
                            <Input
                                id="price"
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                value={formData.price}
                                onChange={(e) =>
                                    setFormData({ ...formData, price: e.target.value })
                                }
                                disabled={isCreating}
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="category">Category *</Label>
                            <select
                                id="category"
                                value={formData.category}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        category: e.target.value,
                                    })
                                }
                                disabled={isCreating}
                                required
                                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                            >
                                <option value="">Select a category</option>
                                {categories.map((cat) => (
                                    <option key={cat} value={cat.toLowerCase()}>
                                        {cat}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Image Upload Section */}
                        <div className="space-y-3">
                            <Label className="text-base font-semibold">
                                Product Images ({formData.images.length}/3)
                            </Label>
                            <p className="text-sm text-muted-foreground">
                                Upload up to 3 high-quality images of your product
                            </p>

                            {/* Image Preview Grid */}
                            {formData.images.length > 0 && (
                                <div className="grid grid-cols-3 gap-3">
                                    {formData.images.map((image, index) => (
                                        <div key={index} className="relative group">
                                            <div className="relative w-full aspect-square rounded-lg overflow-hidden border border-border">
                                                <Image
                                                    src={image}
                                                    alt={`Product image ${index + 1}`}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index)}
                                                className="absolute top-1 right-1 bg-destructive text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Upload Button */}
                            {formData.images.length < 3 && (
                                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors">
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        disabled={uploadingImages || isCreating}
                                        className="hidden"
                                        id="image-upload"
                                    />
                                    <label
                                        htmlFor="image-upload"
                                        className="flex flex-col items-center gap-2 cursor-pointer"
                                    >
                                        {uploadingImages ? (
                                            <>
                                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                                <p className="text-sm text-muted-foreground">
                                                    Uploading...
                                                </p>
                                            </>
                                        ) : (
                                            <>
                                                <Upload className="h-8 w-8 text-muted-foreground" />
                                                <div>
                                                    <p className="font-medium">
                                                        Click to upload or drag and drop
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">
                                                        PNG, JPG, GIF up to 5MB
                                                    </p>
                                                </div>
                                            </>
                                        )}
                                    </label>
                                </div>
                            )}
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleCloseDialog}
                                disabled={isCreating || uploadingImages}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={isCreating || uploadingImages}
                            >
                                {isCreating ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    editingProduct ? "Update Listing" : "Create Listing"
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}
