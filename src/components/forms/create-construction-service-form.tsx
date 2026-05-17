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

interface CreateConstructionServiceFormProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSubmit: (data: Record<string, unknown>) => Promise<void>
    isLoading?: boolean
    inline?: boolean
    defaultSubcategory?: { label: string; slug: string } | null
}

export const CreateConstructionServiceForm = memo(function CreateConstructionServiceForm({
                                                                                             open,
                                                                                             onOpenChange,
                                                                                             onSubmit,
                                                                                             isLoading = false,
                                                                                             inline = false,
                                                                                             defaultSubcategory = null,
                                                                                         }: CreateConstructionServiceFormProps) {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        subcategory: defaultSubcategory?.slug ?? "",
        category: defaultSubcategory?.label ?? "",
        expertise: [] as string[],
        expertiseInput: "",
        yearsOfExperience: "",
        license: "",
        insurance: false,
        availability: "",
        serviceArea: [] as string[],
        serviceAreaInput: "",
        priceType: "",
        certifications: [] as string[],
        certificationInput: "",
        previousProjects: "",
        images: [] as string[],
    })

    const { subcategories, isLoading: isLoadingSubcategories } = useMainCategorySubcategories(MainCategory.CONSTRUCTION_FREELANCERS)

    const handleInputChange = (field: string, value: FormValue) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    const handleAddItem = (type: "expertise" | "serviceArea" | "certifications") => {
        const inputField = `${type}Input` as keyof typeof formData
        const inputValue = formData[inputField] as string
        if (inputValue.trim()) {
            setFormData((prev) => ({
                ...prev,
                [type]: [...prev[type], inputValue.trim()],
                [inputField]: "",
            }))
        }
    }

    const handleRemoveItem = (type: "expertise" | "serviceArea" | "certifications", index: number) => {
        setFormData((prev) => ({ ...prev, [type]: prev[type].filter((_, i) => i !== index) }))
    }

    const resetForm = () => {
        setFormData({
            name: "",
            description: "",
            price: "",
            subcategory: defaultSubcategory?.slug ?? "",
            category: defaultSubcategory?.label ?? "",
            expertise: [],
            expertiseInput: "",
            yearsOfExperience: "",
            license: "",
            insurance: false,
            availability: "",
            serviceArea: [],
            serviceAreaInput: "",
            priceType: "",
            certifications: [],
            certificationInput: "",
            previousProjects: "",
            images: [],
        })
    }

    const handleSubmit = async () => {
        const requiredFields = ["name", "price", "subcategory", "category", "yearsOfExperience", "availability", "priceType"]
        if (requiredFields.some((f) => !formData[f as keyof typeof formData])) return

        await onSubmit({
            name: formData.name,
            description: formData.description,
            price: parseFloat(formData.price),
            subcategory: formData.subcategory,
            category: formData.category,
            expertise: formData.expertise,
            yearsOfExperience: parseInt(formData.yearsOfExperience),
            license: formData.license || undefined,
            insurance: formData.insurance,
            availability: formData.availability,
            serviceArea: formData.serviceArea,
            priceType: formData.priceType,
            certifications: formData.certifications,
            previousProjects: formData.previousProjects ? parseInt(formData.previousProjects) : undefined,
            images: formData.images,
        })

        resetForm()
        if (!inline) onOpenChange(false)
    }

    const isFormValid =
        formData.name && formData.price && formData.subcategory && formData.category &&
        formData.yearsOfExperience && formData.availability && formData.priceType

    const TagList = ({
                         type,
                         items,
                         inputValue,
                         inputField,
                         placeholder,
                     }: {
        type: "expertise" | "serviceArea" | "certifications"
        items: string[]
        inputValue: string
        inputField: string
        placeholder: string
    }) => (
        <div>
            <Label className="capitalize">{type === "serviceArea" ? "Service Areas" : type}</Label>
            <div className="flex gap-2">
                <Input
                    placeholder={placeholder}
                    value={inputValue}
                    onChange={(e) => handleInputChange(inputField, e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAddItem(type) } }}
                    disabled={isLoading}
                />
                <Button variant="outline" onClick={() => handleAddItem(type)} disabled={isLoading || !inputValue.trim()} type="button">
                    Add
                </Button>
            </div>
            {items.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                    {items.map((item, i) => (
                        <div key={i} className="bg-accent text-accent-foreground px-3 py-1 rounded-full flex items-center gap-2">
                            <span className="text-sm">{item}</span>
                            <button onClick={() => handleRemoveItem(type, i)} type="button" className="hover:opacity-70">
                                <X className="h-3 w-3" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )

    const fields = (
        <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
            <div>
                <Label htmlFor="cs-name">Service Name *</Label>
                <Input
                    id="cs-name"
                    placeholder="Professional Roofing Services"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    disabled={isLoading}
                />
            </div>

            <div>
                <Label htmlFor="cs-description">Description</Label>
                <Textarea
                    id="cs-description"
                    placeholder="Describe your services and experience..."
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    disabled={isLoading}
                    rows={3}
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="cs-subcategory">Subcategory *</Label>
                    <Select
                        value={formData.subcategory}
                        onValueChange={(slug) => {
                            const selected = subcategories.find((subcategory) => subcategory.slug === slug)
                            handleInputChange("subcategory", slug)
                            handleInputChange("category", selected?.label ?? slug)
                        }}
                        disabled={isLoading || isLoadingSubcategories || subcategories.length === 0}
                    >
                        <SelectTrigger id="cs-subcategory">
                            <SelectValue placeholder={isLoadingSubcategories ? "Loading subcategories..." : "Select subcategory"} />
                        </SelectTrigger>
                        <SelectContent>
                            {subcategories.map((subcategory) => (
                                <SelectItem key={subcategory.slug} value={subcategory.slug}>{subcategory.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <Label htmlFor="cs-exp">Years of Experience *</Label>
                    <Input
                        id="cs-exp"
                        type="number"
                        placeholder="10"
                        value={formData.yearsOfExperience}
                        onChange={(e) => handleInputChange("yearsOfExperience", e.target.value)}
                        disabled={isLoading}
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="cs-pricetype">Price Type *</Label>
                    <Select value={formData.priceType} onValueChange={(v) => handleInputChange("priceType", v)} disabled={isLoading}>
                        <SelectTrigger id="cs-pricetype">
                            <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="fixed">Fixed</SelectItem>
                            <SelectItem value="hourly">Hourly</SelectItem>
                            <SelectItem value="negotiable">Negotiable</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <Label htmlFor="cs-price">Price (KES) *</Label>
                    <Input
                        id="cs-price"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={formData.price}
                        onChange={(e) => handleInputChange("price", e.target.value)}
                        disabled={isLoading}
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="cs-availability">Availability *</Label>
                    <Select value={formData.availability} onValueChange={(v) => handleInputChange("availability", v)} disabled={isLoading}>
                        <SelectTrigger id="cs-availability">
                            <SelectValue placeholder="Select availability" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="immediately">Immediately</SelectItem>
                            <SelectItem value="within-2-weeks">Within 2 Weeks</SelectItem>
                            <SelectItem value="within-month">Within a Month</SelectItem>
                            <SelectItem value="flexible">Flexible</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <Label htmlFor="cs-license">License (Optional)</Label>
                    <Input
                        id="cs-license"
                        placeholder="License number"
                        value={formData.license}
                        onChange={(e) => handleInputChange("license", e.target.value)}
                        disabled={isLoading}
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="flex items-end pb-1">
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                        <input
                            type="checkbox"
                            checked={formData.insurance}
                            onChange={(e) => handleInputChange("insurance", e.target.checked)}
                            disabled={isLoading}
                            className="rounded"
                        />
                        Has Insurance
                    </label>
                </div>
                <div>
                    <Label htmlFor="cs-projects">Previous Projects</Label>
                    <Input
                        id="cs-projects"
                        type="number"
                        placeholder="100"
                        value={formData.previousProjects}
                        onChange={(e) => handleInputChange("previousProjects", e.target.value)}
                        disabled={isLoading}
                    />
                </div>
            </div>

            <TagList
                type="expertise"
                items={formData.expertise}
                inputValue={formData.expertiseInput}
                inputField="expertiseInput"
                placeholder="e.g., Residential Roofing"
            />
            <TagList
                type="serviceArea"
                items={formData.serviceArea}
                inputValue={formData.serviceAreaInput}
                inputField="serviceAreaInput"
                placeholder="e.g., Westlands, Nairobi"
            />
            <TagList
                type="certifications"
                items={formData.certifications}
                inputValue={formData.certificationInput}
                inputField="certificationInput"
                placeholder="e.g., NCA Certified"
            />

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
                    <DialogTitle>Add Construction Service</DialogTitle>
                    <DialogDescription>Enter your service details and credentials</DialogDescription>
                </DialogHeader>
                {fields}
                {footer}
            </DialogContent>
        </Dialog>
    )
})
