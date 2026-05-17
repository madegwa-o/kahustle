"use client"

import { useState, memo } from "react"
import { Loader2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { CloudinaryImageUploader } from "@/components/cloudinary-image-uploader"
import { MainCategory } from "@/lib/categories"
import { useMainCategorySubcategories } from "@/hooks/use-main-category-subcategories"

type FormValue = string | boolean | string[]

interface CreatePropertyFormProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSubmit: (data: Record<string, unknown>) => Promise<void>
    isLoading?: boolean
    inline?: boolean
    defaultSubcategory?: { label: string; slug: string } | null
}

export const CreatePropertyForm = memo(function CreatePropertyForm({
                                                                       open,
                                                                       onOpenChange,
                                                                       onSubmit,
                                                                       isLoading = false,
                                                                       inline = false,
                                                                       defaultSubcategory = null,
                                                                   }: CreatePropertyFormProps) {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        subcategory: defaultSubcategory?.slug ?? "",
        propertyType: "",
        bedrooms: "",
        bathrooms: "",
        squareFeet: "",
        address: "",
        city: "",
        state: "",
        postalCode: "",
        amenities: [] as string[],
        amenityInput: "",
        yearBuilt: "",
        parking: "street",
        condition: "",
        images: [] as string[],
    })

    const { subcategories, isLoading: isLoadingSubcategories } = useMainCategorySubcategories(MainCategory.PROPERTIES)

    const handleInputChange = (field: string, value: FormValue) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    const handleAddAmenity = () => {
        if (formData.amenityInput.trim()) {
            setFormData((prev) => ({
                ...prev,
                amenities: [...prev.amenities, prev.amenityInput.trim()],
                amenityInput: "",
            }))
        }
    }

    const handleRemoveAmenity = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            amenities: prev.amenities.filter((_, i) => i !== index),
        }))
    }

    const resetForm = () => {
        setFormData({
            name: "",
            description: "",
            price: "",
            subcategory: defaultSubcategory?.slug ?? "",
            propertyType: "",
            bedrooms: "",
            bathrooms: "",
            squareFeet: "",
            address: "",
            city: "",
            state: "",
            postalCode: "",
            amenities: [],
            amenityInput: "",
            yearBuilt: "",
            parking: "street",
            condition: "",
            images: [],
        })
    }

    const handleSubmit = async () => {
        const requiredFields = ["name", "price", "subcategory", "propertyType", "bedrooms", "bathrooms", "squareFeet", "address", "city", "state", "postalCode", "condition"]
        if (requiredFields.some((f) => !formData[f as keyof typeof formData])) return

        await onSubmit({
            name: formData.name,
            description: formData.description,
            price: parseFloat(formData.price),
            subcategory: formData.subcategory,
            propertyType: formData.propertyType,
            bedrooms: parseInt(formData.bedrooms),
            bathrooms: parseFloat(formData.bathrooms),
            squareFeet: parseFloat(formData.squareFeet),
            address: formData.address,
            city: formData.city,
            state: formData.state,
            postalCode: formData.postalCode,
            amenities: formData.amenities,
            yearBuilt: formData.yearBuilt ? parseInt(formData.yearBuilt) : undefined,
            parking: formData.parking,
            condition: formData.condition,
            images: formData.images,
        })

        resetForm()
        if (!inline) onOpenChange(false)
    }

    const isFormValid =
        formData.name && formData.price && formData.subcategory && formData.propertyType && formData.bedrooms &&
        formData.bathrooms && formData.squareFeet && formData.address && formData.city &&
        formData.state && formData.postalCode && formData.condition

    const fields = (
        <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
            <div>
                <Label htmlFor="p-name">Property Name/Title *</Label>
                <Input
                    id="p-name"
                    placeholder="Beautiful Apartment in Downtown"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    disabled={isLoading}
                />
            </div>

            <div>
                <Label htmlFor="p-description">Description</Label>
                <Textarea
                    id="p-description"
                    placeholder="Additional details about the property..."
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    disabled={isLoading}
                    rows={3}
                />
            </div>


            <div>
                <Label htmlFor="p-subcategory">Subcategory *</Label>
                <Select value={formData.subcategory} onValueChange={(v) => handleInputChange("subcategory", v)} disabled={isLoading || isLoadingSubcategories || subcategories.length === 0}>
                    <SelectTrigger id="p-subcategory">
                        <SelectValue placeholder={isLoadingSubcategories ? "Loading subcategories..." : "Select subcategory"} />
                    </SelectTrigger>
                    <SelectContent>
                        {subcategories.map((subcategory) => (
                            <SelectItem key={subcategory.slug} value={subcategory.slug}>{subcategory.label}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="p-type">Property Type *</Label>
                    <Select value={formData.propertyType} onValueChange={(v) => handleInputChange("propertyType", v)} disabled={isLoading}>
                        <SelectTrigger id="p-type">
                            <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="residential">Residential</SelectItem>
                            <SelectItem value="commercial">Commercial</SelectItem>
                            <SelectItem value="land">Land</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <Label htmlFor="p-condition">Condition *</Label>
                    <Select value={formData.condition} onValueChange={(v) => handleInputChange("condition", v)} disabled={isLoading}>
                        <SelectTrigger id="p-condition">
                            <SelectValue placeholder="Select condition" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="excellent">Excellent</SelectItem>
                            <SelectItem value="good">Good</SelectItem>
                            <SelectItem value="fair">Fair</SelectItem>
                            <SelectItem value="needs-repair">Needs Repair</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
                <div>
                    <Label htmlFor="p-bedrooms">Bedrooms *</Label>
                    <Input
                        id="p-bedrooms"
                        type="number"
                        placeholder="3"
                        value={formData.bedrooms}
                        onChange={(e) => handleInputChange("bedrooms", e.target.value)}
                        disabled={isLoading}
                    />
                </div>
                <div>
                    <Label htmlFor="p-bathrooms">Bathrooms *</Label>
                    <Input
                        id="p-bathrooms"
                        type="number"
                        step="0.5"
                        placeholder="2"
                        value={formData.bathrooms}
                        onChange={(e) => handleInputChange("bathrooms", e.target.value)}
                        disabled={isLoading}
                    />
                </div>
                <div>
                    <Label htmlFor="p-sqft">Sq. Feet *</Label>
                    <Input
                        id="p-sqft"
                        type="number"
                        placeholder="2000"
                        value={formData.squareFeet}
                        onChange={(e) => handleInputChange("squareFeet", e.target.value)}
                        disabled={isLoading}
                    />
                </div>
            </div>

            <div>
                <Label htmlFor="p-address">Address *</Label>
                <Input
                    id="p-address"
                    placeholder="123 Main Street"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    disabled={isLoading}
                />
            </div>

            <div className="grid grid-cols-3 gap-4">
                <div>
                    <Label htmlFor="p-city">City *</Label>
                    <Input
                        id="p-city"
                        placeholder="Nairobi"
                        value={formData.city}
                        onChange={(e) => handleInputChange("city", e.target.value)}
                        disabled={isLoading}
                    />
                </div>
                <div>
                    <Label htmlFor="p-state">County *</Label>
                    <Input
                        id="p-state"
                        placeholder="Nairobi"
                        value={formData.state}
                        onChange={(e) => handleInputChange("state", e.target.value)}
                        disabled={isLoading}
                    />
                </div>
                <div>
                    <Label htmlFor="p-postal">Postal Code *</Label>
                    <Input
                        id="p-postal"
                        placeholder="00100"
                        value={formData.postalCode}
                        onChange={(e) => handleInputChange("postalCode", e.target.value)}
                        disabled={isLoading}
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="p-parking">Parking</Label>
                    <Select value={formData.parking} onValueChange={(v) => handleInputChange("parking", v)} disabled={isLoading}>
                        <SelectTrigger id="p-parking">
                            <SelectValue placeholder="Select parking" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            <SelectItem value="street">Street</SelectItem>
                            <SelectItem value="garage">Garage</SelectItem>
                            <SelectItem value="lot">Lot</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <Label htmlFor="p-year">Year Built (Optional)</Label>
                    <Input
                        id="p-year"
                        type="number"
                        placeholder="2000"
                        value={formData.yearBuilt}
                        onChange={(e) => handleInputChange("yearBuilt", e.target.value)}
                        disabled={isLoading}
                    />
                </div>
            </div>

            <div>
                <Label htmlFor="p-price">Price (KES) *</Label>
                <Input
                    id="p-price"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                    disabled={isLoading}
                />
            </div>

            <div>
                <Label>Amenities</Label>
                <div className="flex gap-2">
                    <Input
                        placeholder="e.g., Pool, Gym, Parking"
                        value={formData.amenityInput}
                        onChange={(e) => handleInputChange("amenityInput", e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAddAmenity() } }}
                        disabled={isLoading}
                    />
                    <Button variant="outline" onClick={handleAddAmenity} disabled={isLoading || !formData.amenityInput.trim()} type="button">
                        Add
                    </Button>
                </div>
                {formData.amenities.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                        {formData.amenities.map((a, i) => (
                            <div key={i} className="bg-accent text-accent-foreground px-3 py-1 rounded-full flex items-center gap-2">
                                <span className="text-sm">{a}</span>
                                <button onClick={() => handleRemoveAmenity(i)} type="button" className="hover:opacity-70">
                                    <X className="h-3 w-3" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div>
                <CloudinaryImageUploader
                    maxImages={3}
                    disabled={isLoading}
                    onImagesChange={(images) => handleInputChange("images", images)}
                />
            </div>
        </div>
    )

    const footer = (
        <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
                Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isLoading || !isFormValid}>
                {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Creating...</> : "Create Listing"}
            </Button>
        </DialogFooter>
    )

    if (inline) {
        return <>{fields}{footer}</>
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Add Property Listing</DialogTitle>
                    <DialogDescription>Enter property details and specifications</DialogDescription>
                </DialogHeader>
                {fields}
                {footer}
            </DialogContent>
        </Dialog>
    )
})
