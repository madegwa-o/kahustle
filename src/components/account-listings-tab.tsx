"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Plus, Trash2, Loader2, Eye, ArrowLeft, ChevronRight, Car, Home, Briefcase, Wrench } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Image from "next/image"
import Link from "next/link"
import type { IProduct } from "@/models/Product"
import { MainCategory } from "@/lib/categories"
import { Role } from "@/lib/roles"
import { CreateVehicleForm } from "@/components/forms/create-vehicle-form"
import { CreatePropertyForm } from "@/components/forms/create-property-form"
import { CreateJobForm } from "@/components/forms/create-job-form"
import { CreateConstructionServiceForm } from "@/components/forms/create-construction-service-form"

// ─── Types ────────────────────────────────────────────────────────────────────

interface Product extends Omit<IProduct, "_id" | "userId"> {
    _id: string
    userId: string
}

interface ISubcategory {
    label: string
    slug: string
}

interface ICategory {
    _id: string
    mainCategory: MainCategory
    subcategories: ISubcategory[]
}

type DialogStep = "category" | "subcategory" | "form"

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORY_META: Record<MainCategory, {
    label: string
    icon: React.ReactNode
    colorClasses: string
    description: string
}> = {
    [MainCategory.VEHICLES]: {
        label: "Vehicles",
        icon: <Car className="h-5 w-5" />,
        colorClasses: "border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100",
        description: "Cars, bikes, trucks & parts",
    },
    [MainCategory.PROPERTIES]: {
        label: "Property",
        icon: <Home className="h-5 w-5" />,
        colorClasses: "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100",
        description: "Homes, land & commercial",
    },
    [MainCategory.CAREERS]: {
        label: "Jobs",
        icon: <Briefcase className="h-5 w-5" />,
        colorClasses: "border-violet-200 bg-violet-50 text-violet-700 hover:bg-violet-100",
        description: "Local job opportunities",
    },
    [MainCategory.CONSTRUCTION_FREELANCERS]: {
        label: "Construction",
        icon: <Wrench className="h-5 w-5" />,
        colorClasses: "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100",
        description: "Contractors & skilled trades",
    },
}

const API_MAP: Record<MainCategory, string> = {
    [MainCategory.VEHICLES]: "/api/vehicles",
    [MainCategory.PROPERTIES]: "/api/properties",
    [MainCategory.CAREERS]: "/api/jobs",
    [MainCategory.CONSTRUCTION_FREELANCERS]: "/api/construction-services",
}

const SUCCESS_MSG: Record<MainCategory, string> = {
    [MainCategory.VEHICLES]: "Vehicle listing created!",
    [MainCategory.PROPERTIES]: "Property listing created!",
    [MainCategory.CAREERS]: "Job listing created!",
    [MainCategory.CONSTRUCTION_FREELANCERS]: "Service listing created!",
}

const STEPS: DialogStep[] = ["category", "subcategory", "form"]

// ─── Component ────────────────────────────────────────────────────────────────

export default function AccountListingsTab() {
    const { data: session } = useSession()

    // List state
    const [products, setProducts] = useState<Product[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)

    // Categories (fetched from DB)
    const [categories, setCategories] = useState<ICategory[]>([])

    // Dialog / stepper state
    const [openDialog, setOpenDialog] = useState(false)
    const [step, setStep] = useState<DialogStep>("category")
    const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(null)
    const [selectedSubcategory, setSelectedSubcategory] = useState<ISubcategory | null>(null)
    const [isCreating, setIsCreating] = useState(false)

    const canManageAll =
        session?.user?.roles?.includes(Role.STAFF) ||
        session?.user?.roles?.includes(Role.ADMIN)

    // ── Fetch on mount ──────────────────────────────────────────────────────

    useEffect(() => {
        if (!session?.user) return

        const load = async () => {
            try {
                const [catRes, vehiclesRes, propertiesRes, jobsRes, constructionRes, productsRes] = await Promise.all([
                    fetch("/api/categories"),
                    fetch(canManageAll ? "/api/vehicles" : `/api/vehicles?userId=${session.user.id}`),
                    fetch(canManageAll ? "/api/properties" : `/api/properties?userId=${session.user.id}`),
                    fetch(canManageAll ? "/api/jobs" : `/api/jobs?userId=${session.user.id}`),
                    fetch(canManageAll ? "/api/construction-services" : `/api/construction-services?userId=${session.user.id}`),
                    fetch(canManageAll ? "/api/products" : `/api/products?userId=${session.user.id}`),
                ])
                
                const catData = await catRes.json()
                const vehiclesData = await vehiclesRes.json()
                const propertiesData = await propertiesRes.json()
                const jobsData = await jobsRes.json()
                const constructionData = await constructionRes.json()
                const productsData = await productsRes.json()

                if (catData.categories) setCategories(catData.categories)
                
                // Aggregate all products from different endpoints
                const allProducts: Product[] = [
                    ...(productsData.products || []),
                    ...(vehiclesData.vehicles || []),
                    ...(propertiesData.properties || []),
                    ...(jobsData.jobs || []),
                    ...(constructionData.services || []),
                ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                
                setProducts(allProducts)
                if (allProducts.length === 0 && !productsData.success && !vehiclesData.vehicles && !propertiesData.properties && !jobsData.jobs && !constructionData.services) {
                    setError("Failed to load your listings")
                }
            } catch (err) {
                console.error("[v0] Error loading listings:", err)
                setError("Failed to load your listings")
            } finally {
                setIsLoading(false)
            }
        }

        load()
    }, [session?.user, canManageAll])

    // ── Dialog helpers ──────────────────────────────────────────────────────

    const openCreateDialog = () => {
        setStep("category")
        setSelectedCategory(null)
        setSelectedSubcategory(null)
        setError(null)
        setSuccess(null)
        setOpenDialog(true)
    }

    const handleCloseDialog = () => {
        setOpenDialog(false)
        setTimeout(() => {
            setStep("category")
            setSelectedCategory(null)
            setSelectedSubcategory(null)
        }, 200)
    }

    const handleSelectCategory = (cat: ICategory) => {
        setSelectedCategory(cat)
        if (cat.subcategories.length === 1) {
            setSelectedSubcategory(cat.subcategories[0])
            setStep("form")
        } else {
            setStep("subcategory")
        }
    }

    const handleSelectSubcategory = (sub: ISubcategory) => {
        setSelectedSubcategory(sub)
        setStep("form")
    }

    const handleBack = () => {
        if (step === "form") {
            if (selectedCategory && selectedCategory.subcategories.length === 1) {
                setStep("category")
                setSelectedCategory(null)
                setSelectedSubcategory(null)
            } else {
                setStep("subcategory")
                setSelectedSubcategory(null)
            }
        } else if (step === "subcategory") {
            setStep("category")
            setSelectedCategory(null)
        }
    }

    // ── Submission ───���──────────────────────────────────────────────────────

    const handleFormSubmit = async (data: any) => {
        if (!selectedCategory || !session?.user) return
        setIsCreating(true)
        setError(null)
        try {
            const res = await fetch(API_MAP[selectedCategory.mainCategory], {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...data,
                    subcategory: selectedSubcategory?.slug,
                }),
            })
            const result = await res.json()
            if (!res.ok) {
                setError(result.error || "Failed to create listing")
                return
            }
            setSuccess(SUCCESS_MSG[selectedCategory.mainCategory])
            
            // Reload all listings after successful creation
            setTimeout(() => {
                const load = async () => {
                    try {
                        const [vehiclesRes, propertiesRes, jobsRes, constructionRes, productsRes] = await Promise.all([
                            fetch(canManageAll ? "/api/vehicles" : `/api/vehicles?userId=${session.user.id}`),
                            fetch(canManageAll ? "/api/properties" : `/api/properties?userId=${session.user.id}`),
                            fetch(canManageAll ? "/api/jobs" : `/api/jobs?userId=${session.user.id}`),
                            fetch(canManageAll ? "/api/construction-services" : `/api/construction-services?userId=${session.user.id}`),
                            fetch(canManageAll ? "/api/products" : `/api/products?userId=${session.user.id}`),
                        ])
                        
                        const vehiclesData = await vehiclesRes.json()
                        const propertiesData = await propertiesRes.json()
                        const jobsData = await jobsRes.json()
                        const constructionData = await constructionRes.json()
                        const productsData = await productsRes.json()
                        
                        const allProducts: Product[] = [
                            ...(productsData.products || []),
                            ...(vehiclesData.vehicles || []),
                            ...(propertiesData.properties || []),
                            ...(jobsData.jobs || []),
                            ...(constructionData.services || []),
                        ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                        
                        setProducts(allProducts)
                    } catch (err) {
                        console.error("[v0] Error reloading listings:", err)
                    }
                }
                load()
                handleCloseDialog()
                setSuccess(null)
            }, 1500)
        } catch {
            setError("Failed to create listing")
        } finally {
            setIsCreating(false)
        }
    }

    // ── Delete ──────────────────────────────────────────────────────────────

    const handleDelete = async (id: string) => {
        if (!window.confirm("Delete this listing?")) return
        try {
            // Try deleting from all possible endpoints since we don't know which type it is
            const endpoints = [
                `/api/products/${id}`,
                `/api/vehicles/${id}`,
                `/api/properties/${id}`,
                `/api/jobs/${id}`,
                `/api/construction-services/${id}`,
            ]
            
            let deleted = false
            for (const endpoint of endpoints) {
                try {
                    const res = await fetch(endpoint, { method: "DELETE" })
                    if (res.ok) {
                        deleted = true
                        break
                    }
                } catch {
                    // Continue to next endpoint
                }
            }
            
            if (!deleted) {
                setError("Delete failed")
                return
            }
            
            setProducts(prev => prev.filter(p => p._id !== id))
            setSuccess("Listing deleted")
            setTimeout(() => setSuccess(null), 2000)
        } catch {
            setError("Delete failed")
        }
    }

    // ── Dialog title ────────────────────────────────────────────────────────

    const dialogTitle = (() => {
        if (step === "category") return "What are you listing?"
        if (step === "subcategory" && selectedCategory) {
            const meta = CATEGORY_META[selectedCategory.mainCategory]
            return `Choose a ${meta?.label ?? selectedCategory.mainCategory} type`
        }
        if (step === "form" && selectedCategory && selectedSubcategory) {
            const meta = CATEGORY_META[selectedCategory.mainCategory]
            return `${meta?.label} · ${selectedSubcategory.label}`
        }
        return "New Listing"
    })()

    // ── Render ──────────────────────────────────────────────────────────────

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

            {/* ── Listings card ── */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-4">
                    <div>
                        <CardTitle className="text-lg">My Listings</CardTitle>
                        <CardDescription>
                            {products.length} {products.length === 1 ? "listing" : "listings"}
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
                                <div key={product._id} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
                                    {product.images.length > 0 ? (
                                        <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
                                            <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                                        </div>
                                    ) : (
                                        <div className="w-16 h-16 rounded-lg bg-muted flex-shrink-0" />
                                    )}

                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-sm truncate">{product.name}</p>
                                        <p className="text-xs text-muted-foreground mt-0.5">
                                            {product.category || "Listing"}
                                        </p>
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

            {/* ── Stepper dialog ── */}
            <Dialog open={openDialog} onOpenChange={(open) => { if (!open) handleCloseDialog() }}>
                <DialogContent className="sm:max-w-[520px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <div className="flex items-center gap-2">
                            {step !== "category" && (
                                <button
                                    onClick={handleBack}
                                    className="p-1 rounded-md hover:bg-muted transition-colors flex-shrink-0"
                                    aria-label="Go back"
                                >
                                    <ArrowLeft className="h-4 w-4 text-muted-foreground" />
                                </button>
                            )}
                            <div>
                                <DialogTitle>{dialogTitle}</DialogTitle>
                                {step === "category" && (
                                    <DialogDescription className="mt-0.5">
                                        Select a category to get started
                                    </DialogDescription>
                                )}
                            </div>
                        </div>

                        {/* Progress bar */}
                        <div className="flex items-center gap-1.5 pt-3">
                            {STEPS.map((s) => {
                                const currentIdx = STEPS.indexOf(step)
                                const thisIdx = STEPS.indexOf(s)
                                return (
                                    <div
                                        key={s}
                                        className={`h-1 rounded-full flex-1 transition-colors duration-300 ${
                                            thisIdx === currentIdx
                                                ? "bg-primary"
                                                : thisIdx < currentIdx
                                                    ? "bg-primary/40"
                                                    : "bg-muted"
                                        }`}
                                    />
                                )
                            })}
                        </div>
                    </DialogHeader>

                    {/* Step 1 — Main category */}
                    {step === "category" && (
                        <div className="grid grid-cols-2 gap-3 py-2">
                            {categories.map((cat) => {
                                const meta = CATEGORY_META[cat.mainCategory]
                                if (!meta) return null
                                return (
                                    <button
                                        key={cat._id}
                                        onClick={() => handleSelectCategory(cat)}
                                        className={`flex flex-col items-start gap-3 p-4 rounded-xl border-2 text-left transition-all ${meta.colorClasses}`}
                                    >
                                        <span className="p-2 bg-white/60 rounded-lg">{meta.icon}</span>
                                        <div>
                                            <p className="font-semibold text-sm">{meta.label}</p>
                                            <p className="text-xs opacity-70 mt-0.5 leading-tight">{meta.description}</p>
                                        </div>
                                        <ChevronRight className="h-4 w-4 self-end opacity-40 mt-auto" />
                                    </button>
                                )
                            })}
                        </div>
                    )}

                    {/* Step 2 — Subcategory */}
                    {step === "subcategory" && selectedCategory && (
                        <div className="space-y-2 py-2">
                            {selectedCategory.subcategories.map((sub) => (
                                <button
                                    key={sub.slug}
                                    onClick={() => handleSelectSubcategory(sub)}
                                    className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl border-2 border-border hover:border-primary hover:bg-primary/5 transition-all text-left"
                                >
                                    <span className="font-medium text-sm">{sub.label}</span>
                                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Step 3 — Specialist forms rendered inline */}
                    {step === "form" && selectedCategory?.mainCategory === MainCategory.VEHICLES && (
                        <CreateVehicleForm
                            open={true}
                            onOpenChange={() => {}}
                            onSubmit={handleFormSubmit}
                            isLoading={isCreating}
                            inline
                        />
                    )}
                    {step === "form" && selectedCategory?.mainCategory === MainCategory.PROPERTIES && (
                        <CreatePropertyForm
                            open={true}
                            onOpenChange={() => {}}
                            onSubmit={handleFormSubmit}
                            isLoading={isCreating}
                            inline
                        />
                    )}
                    {step === "form" && selectedCategory?.mainCategory === MainCategory.CAREERS && (
                        <CreateJobForm
                            open={true}
                            onOpenChange={() => {}}
                            onSubmit={handleFormSubmit}
                            isLoading={isCreating}
                            inline
                        />
                    )}
                    {step === "form" && selectedCategory?.mainCategory === MainCategory.CONSTRUCTION_FREELANCERS && (
                        <CreateConstructionServiceForm
                            open={true}
                            onOpenChange={() => {}}
                            onSubmit={handleFormSubmit}
                            isLoading={isCreating}
                            inline
                        />
                    )}

                    {/* Inline form error */}
                    {step === "form" && error && (
                        <Alert variant="destructive" className="mt-2">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}
