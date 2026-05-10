"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import {
    Plus, Edit2, Trash2, Loader2, Eye, X,
    Car, Home, Briefcase, Wrench, ChevronRight, ArrowLeft
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Image from "next/image"
import Link from "next/link"
import type { IProduct } from "@/models/Product"
import { Role } from "@/lib/roles"
import { CreateVehicleForm } from "@/components/forms/create-vehicle-form"
import { CreatePropertyForm } from "@/components/forms/create-property-form"
import { CreateJobForm } from "@/components/forms/create-job-form"
import { CreateConstructionServiceForm } from "@/components/forms/create-construction-service-form"

interface Product extends Omit<IProduct, "_id" | "userId"> {
    _id: string
    userId: string
}

type MainCategory = "vehicles" | "property" | "jobs" | "construction"
type FormType = "vehicle" | "property" | "job" | "construction"

interface CategoryConfig {
    id: MainCategory
    label: string
    icon: React.ReactNode
    color: string
    description: string
    subcategories: { value: string; label: string }[]
}

const CATEGORIES: CategoryConfig[] = [
    {
        id: "vehicles",
        label: "Vehicles",
        icon: <Car className="h-6 w-6" />,
        color: "bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100",
        description: "Cars, bikes, trucks & parts",
        subcategories: [
            { value: "cars", label: "Cars" },
            { value: "motorbikes", label: "Motorbikes & Scooters" },
            { value: "trucks", label: "Trucks, Vans & Buses" },
            { value: "auto-parts", label: "Auto Parts & Accessories" },
            { value: "bicycles", label: "Bicycles & 3 Wheelers" },
        ],
    },
    {
        id: "property",
        label: "Property",
        icon: <Home className="h-6 w-6" />,
        color: "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100",
        description: "Homes, land & commercial spaces",
        subcategories: [
            { value: "apartments", label: "Apartments & Flats" },
            { value: "houses", label: "Houses" },
            { value: "commercial", label: "Commercial Property" },
            { value: "land", label: "Plots & Land" },
        ],
    },
    {
        id: "jobs",
        label: "Jobs",
        icon: <Briefcase className="h-6 w-6" />,
        color: "bg-violet-50 border-violet-200 text-violet-700 hover:bg-violet-100",
        description: "Local job opportunities",
        subcategories: [
            { value: "local-jobs", label: "Local Jobs" },
        ],
    },
    {
        id: "construction",
        label: "Construction",
        icon: <Wrench className="h-6 w-6" />,
        color: "bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100",
        description: "Contractors & skilled services",
        subcategories: [
            { value: "plumber", label: "Plumber" },
            { value: "building", label: "Building Construction" },
            { value: "electrician", label: "Electrician" },
            { value: "masonry", label: "Masonry" },
            { value: "carpentry", label: "Carpentry" },
        ],
    },
]

const FORM_MAP: Record<MainCategory, FormType> = {
    vehicles: "vehicle",
    property: "property",
    jobs: "job",
    construction: "construction",
}

type DialogStep = "category" | "subcategory" | "form"

export default function AccountListingsTab() {
    const { data: session } = useSession()
    const [products, setProducts] = useState<Product[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isCreating, setIsCreating] = useState(false)
    const [openDialog, setOpenDialog] = useState(false)

    const [dialogStep, setDialogStep] = useState<DialogStep>("category")
    const [selectedMain, setSelectedMain] = useState<MainCategory | null>(null)
    const [selectedSub, setSelectedSub] = useState<string | null>(null)

    const [editingProduct, setEditingProduct] = useState<Product | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)

    const canManageAllProducts =
        session?.user?.roles?.includes(Role.STAFF) ||
        session?.user?.roles?.includes(Role.ADMIN)

    useEffect(() => {
        const fetchProducts = async () => {
            if (!session?.user) return
            try {
                const response = await fetch(
                    canManageAllProducts
                        ? `/api/products`
                        : `/api/products?userId=${session.user.id}`
                )
                const data = await response.json()
                if (data.success) {
                    setProducts(data.products)
                } else {
                    setError("Failed to load your listings")
                }
            } catch {
                setError("Failed to load your listings")
            } finally {
                setIsLoading(false)
            }
        }
        fetchProducts()
    }, [session?.user, canManageAllProducts])

    const openCreateDialog = () => {
        setDialogStep("category")
        setSelectedMain(null)
        setSelectedSub(null)
        setEditingProduct(null)
        setError(null)
        setSuccess(null)
        setOpenDialog(true)
    }

    const handleSelectMain = (cat: MainCategory) => {
        setSelectedMain(cat)
        // If only one subcategory (jobs), skip subcategory step
        const config = CATEGORIES.find(c => c.id === cat)!
        if (config.subcategories.length === 1) {
            setSelectedSub(config.subcategories[0].value)
            setDialogStep("form")
        } else {
            setDialogStep("subcategory")
        }
    }

    const handleSelectSub = (sub: string) => {
        setSelectedSub(sub)
        setDialogStep("form")
    }

    const handleBack = () => {
        if (dialogStep === "subcategory") {
            setDialogStep("category")
            setSelectedMain(null)
        } else if (dialogStep === "form") {
            const config = CATEGORIES.find(c => c.id === selectedMain)!
            if (config.subcategories.length === 1) {
                setDialogStep("category")
                setSelectedMain(null)
                setSelectedSub(null)
            } else {
                setDialogStep("subcategory")
                setSelectedSub(null)
            }
        }
    }

    const handleCloseDialog = () => {
        setOpenDialog(false)
        setEditingProduct(null)
        setDialogStep("category")
        setSelectedMain(null)
        setSelectedSub(null)
    }

    const handleDelete = async (productId: string) => {
        if (!window.confirm("Are you sure you want to delete this listing?")) return
        try {
            const response = await fetch(`/api/products/${productId}`, { method: "DELETE" })
            const data = await response.json()
            if (!response.ok) {
                setError(data.error || "Failed to delete listing")
                return
            }
            setProducts(products.filter((p) => p._id !== productId))
            setSuccess("Listing deleted successfully")
            setTimeout(() => setSuccess(null), 2000)
        } catch {
            setError("Failed to delete listing")
        }
    }

    const makeSubmitHandler = (apiPath: string, successMessage: string) => async (data: any) => {
        setIsCreating(true)
        setError(null)
        try {
            const response = await fetch(apiPath, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...data, subcategory: selectedSub }),
            })
            const result = await response.json()
            if (!response.ok) {
                setError(result.error || "Failed to create listing")
                return
            }
            setSuccess(successMessage)
            setTimeout(() => {
                handleCloseDialog()
                setSuccess(null)
            }, 1500)
        } catch {
            setError("Failed to create listing")
        } finally {
            setIsCreating(false)
        }
    }

    const mainConfig = selectedMain ? CATEGORIES.find(c => c.id === selectedMain)! : null
    const formType = selectedMain ? FORM_MAP[selectedMain] : null

    const dialogTitle =
        dialogStep === "category" ? "What are you listing?" :
            dialogStep === "subcategory" ? `Choose a ${mainConfig?.label} type` :
                `${mainConfig?.label} · ${mainConfig?.subcategories.find(s => s.value === selectedSub)?.label}`

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-16">
                <Loader2 className="h-7 w-7 animate-spin text-muted-foreground" />
            </div>
        )
    }

    return (
        <div className="space-y-5">
            {error && (
                <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}
            {success && (
                <Alert className="border-emerald-200 bg-emerald-50">
                    <AlertDescription className="text-emerald-700">{success}</AlertDescription>
                </Alert>
            )}

            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-4">
                    <div>
                        <CardTitle className="text-lg">My Listings</CardTitle>
                        <CardDescription>
                            {products.length} active {products.length === 1 ? "listing" : "listings"}
                        </CardDescription>
                    </div>
                    <Button onClick={openCreateDialog} size="sm" className="gap-1.5">
                        <Plus className="h-4 w-4" />
                        New Listing
                    </Button>
                </CardHeader>

                <CardContent>
                    {products.length === 0 ? (
                        <div className="text-center py-14 border-2 border-dashed border-border rounded-xl">
                            <p className="text-muted-foreground text-sm mb-4">No listings yet</p>
                            <Button onClick={openCreateDialog} variant="outline" size="sm" className="gap-1.5">
                                <Plus className="h-4 w-4" />
                                Create your first listing
                            </Button>
                        </div>
                    ) : (
                        <div className="divide-y divide-border">
                            {products.map((product) => (
                                <div
                                    key={product._id}
                                    className="flex items-center gap-4 py-4 first:pt-0 last:pb-0"
                                >
                                    {product.images.length > 0 ? (
                                        <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
                                            <Image
                                                src={product.images[0]}
                                                alt={product.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    ) : (
                                        <div className="w-16 h-16 rounded-lg bg-muted flex-shrink-0" />
                                    )}

                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-sm truncate">{product.name}</p>
                                        <p className="text-xs text-muted-foreground mt-0.5">{product.category}</p>
                                        <div className="flex items-center gap-3 mt-1.5">
                                            <span className="text-sm font-semibold text-primary">
                                                KES {product.price.toLocaleString()}
                                            </span>
                                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                <Eye className="h-3 w-3" />
                                                {product.views}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-1 flex-shrink-0">
                                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                            product.status === "active"
                                                ? "bg-emerald-50 text-emerald-700"
                                                : "bg-muted text-muted-foreground"
                                        }`}>
                                            {product.status}
                                        </span>
                                        <Button variant="ghost" size="sm" asChild className="text-xs">
                                            <Link href={`/product/${product._id}`}>View</Link>
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8"
                                            onClick={() => handleDelete(product._id)}
                                        >
                                            <Trash2 className="h-3.5 w-3.5 text-destructive" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Unified stepper dialog */}
            <Dialog open={openDialog} onOpenChange={(open) => { if (!open) handleCloseDialog() }}>
                <DialogContent className="sm:max-w-[520px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <div className="flex items-center gap-2">
                            {dialogStep !== "category" && (
                                <button
                                    onClick={handleBack}
                                    className="p-1 rounded hover:bg-muted transition-colors"
                                >
                                    <ArrowLeft className="h-4 w-4 text-muted-foreground" />
                                </button>
                            )}
                            <div>
                                <DialogTitle>{dialogTitle}</DialogTitle>
                                {dialogStep === "category" && (
                                    <DialogDescription className="mt-0.5">
                                        Select a main category to get started
                                    </DialogDescription>
                                )}
                            </div>
                        </div>

                        {/* Step indicator */}
                        <div className="flex items-center gap-1.5 pt-2">
                            {["category", "subcategory", "form"].map((step, i) => (
                                <div
                                    key={step}
                                    className={`h-1 rounded-full flex-1 transition-colors ${
                                        dialogStep === step
                                            ? "bg-primary"
                                            : i < ["category", "subcategory", "form"].indexOf(dialogStep)
                                                ? "bg-primary/40"
                                                : "bg-muted"
                                    }`}
                                />
                            ))}
                        </div>
                    </DialogHeader>

                    {/* Step 1: Main category */}
                    {dialogStep === "category" && (
                        <div className="grid grid-cols-2 gap-3 py-2">
                            {CATEGORIES.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => handleSelectMain(cat.id)}
                                    className={`flex flex-col items-start gap-2 p-4 rounded-xl border-2 transition-all text-left ${cat.color}`}
                                >
                                    <span className="p-2 bg-white/60 rounded-lg">{cat.icon}</span>
                                    <div>
                                        <p className="font-semibold text-sm">{cat.label}</p>
                                        <p className="text-xs opacity-70 mt-0.5 leading-tight">{cat.description}</p>
                                    </div>
                                    <ChevronRight className="h-4 w-4 self-end opacity-50" />
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Step 2: Subcategory */}
                    {dialogStep === "subcategory" && mainConfig && (
                        <div className="space-y-2 py-2">
                            {mainConfig.subcategories.map((sub) => (
                                <button
                                    key={sub.value}
                                    onClick={() => handleSelectSub(sub.value)}
                                    className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl border-2 border-border hover:border-primary hover:bg-primary/5 transition-all text-left"
                                >
                                    <span className="font-medium text-sm">{sub.label}</span>
                                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Step 3: Form (rendered inline, not as separate dialogs) */}
                    {dialogStep === "form" && formType === "vehicle" && (
                        <CreateVehicleForm
                            onSubmit={makeSubmitHandler("/api/vehicles", "Vehicle listing created!")}
                            onCancel={handleCloseDialog}
                            isLoading={isCreating}
                            error={error}
                        />
                    )}
                    {dialogStep === "form" && formType === "property" && (
                        <CreatePropertyForm
                            onSubmit={makeSubmitHandler("/api/properties", "Property listing created!")}
                            onCancel={handleCloseDialog}
                            isLoading={isCreating}
                            error={error}
                        />
                    )}
                    {dialogStep === "form" && formType === "job" && (
                        <CreateJobForm
                            onSubmit={makeSubmitHandler("/api/jobs", "Job listing created!")}
                            onCancel={handleCloseDialog}
                            isLoading={isCreating}
                            error={error}
                        />
                    )}
                    {dialogStep === "form" && formType === "construction" && (
                        <CreateConstructionServiceForm
                            onSubmit={makeSubmitHandler("/api/construction-services", "Service listing created!")}
                            onCancel={handleCloseDialog}
                            isLoading={isCreating}
                            error={error}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}