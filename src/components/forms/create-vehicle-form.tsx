"use client"

import { useState, memo } from "react"
import { Loader2 } from "lucide-react"
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

interface CreateVehicleFormProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSubmit: (data: any) => Promise<void>
    isLoading?: boolean
    inline?: boolean
}

export const CreateVehicleForm = memo(function CreateVehicleForm({
                                                                     open,
                                                                     onOpenChange,
                                                                     onSubmit,
                                                                     isLoading = false,
                                                                     inline = false,
                                                                 }: CreateVehicleFormProps) {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        make: "",
        vehicleModel: "",
        year: new Date().getFullYear().toString(),
        mileage: "",
        fuelType: "",
        transmission: "",
        bodyType: "",
        color: "",
        condition: "",
        vin: "",
    })

    const handleInputChange = (field: string, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    const resetForm = () => {
        setFormData({
            name: "",
            description: "",
            price: "",
            make: "",
            vehicleModel: "",
            year: new Date().getFullYear().toString(),
            mileage: "",
            fuelType: "",
            transmission: "",
            bodyType: "",
            color: "",
            condition: "",
            vin: "",
        })
    }

    const handleSubmit = async () => {
        const requiredFields = ["name", "price", "make", "vehicleModel", "year", "mileage", "fuelType", "transmission", "bodyType", "color", "condition"]
        if (requiredFields.some((f) => !formData[f as keyof typeof formData])) return

        await onSubmit({
            ...formData,
            price: parseFloat(formData.price),
            year: parseInt(formData.year),
            mileage: parseFloat(formData.mileage),
            images: [],
        })

        resetForm()
        if (!inline) onOpenChange(false)
    }

    const isFormValid =
        formData.name && formData.price && formData.make && formData.vehicleModel &&
        formData.year && formData.mileage && formData.fuelType && formData.transmission &&
        formData.bodyType && formData.color && formData.condition

    const fields = (
        <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
            <div>
                <Label htmlFor="v-name">Vehicle Name/Title *</Label>
                <Input
                    id="v-name"
                    placeholder="2022 Honda Civic"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    disabled={isLoading}
                />
            </div>

            <div>
                <Label htmlFor="v-description">Description</Label>
                <Textarea
                    id="v-description"
                    placeholder="Additional details about the vehicle..."
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    disabled={isLoading}
                    rows={3}
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="v-make">Make *</Label>
                    <Input
                        id="v-make"
                        placeholder="Honda"
                        value={formData.make}
                        onChange={(e) => handleInputChange("make", e.target.value)}
                        disabled={isLoading}
                    />
                </div>
                <div>
                    <Label htmlFor="v-model">Model *</Label>
                    <Input
                        id="v-model"
                        placeholder="Civic"
                        value={formData.vehicleModel}
                        onChange={(e) => handleInputChange("vehicleModel", e.target.value)}
                        disabled={isLoading}
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="v-year">Year *</Label>
                    <Input
                        id="v-year"
                        type="number"
                        placeholder="2022"
                        value={formData.year}
                        onChange={(e) => handleInputChange("year", e.target.value)}
                        disabled={isLoading}
                    />
                </div>
                <div>
                    <Label htmlFor="v-mileage">Mileage (km) *</Label>
                    <Input
                        id="v-mileage"
                        type="number"
                        placeholder="50000"
                        value={formData.mileage}
                        onChange={(e) => handleInputChange("mileage", e.target.value)}
                        disabled={isLoading}
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="v-fuel">Fuel Type *</Label>
                    <Select value={formData.fuelType} onValueChange={(v) => handleInputChange("fuelType", v)} disabled={isLoading}>
                        <SelectTrigger id="v-fuel">
                            <SelectValue placeholder="Select fuel type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="petrol">Petrol</SelectItem>
                            <SelectItem value="diesel">Diesel</SelectItem>
                            <SelectItem value="hybrid">Hybrid</SelectItem>
                            <SelectItem value="electric">Electric</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <Label htmlFor="v-transmission">Transmission *</Label>
                    <Select value={formData.transmission} onValueChange={(v) => handleInputChange("transmission", v)} disabled={isLoading}>
                        <SelectTrigger id="v-transmission">
                            <SelectValue placeholder="Select transmission" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="manual">Manual</SelectItem>
                            <SelectItem value="automatic">Automatic</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="v-body">Body Type *</Label>
                    <Input
                        id="v-body"
                        placeholder="Sedan"
                        value={formData.bodyType}
                        onChange={(e) => handleInputChange("bodyType", e.target.value)}
                        disabled={isLoading}
                    />
                </div>
                <div>
                    <Label htmlFor="v-color">Color *</Label>
                    <Input
                        id="v-color"
                        placeholder="Black"
                        value={formData.color}
                        onChange={(e) => handleInputChange("color", e.target.value)}
                        disabled={isLoading}
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="v-condition">Condition *</Label>
                    <Select value={formData.condition} onValueChange={(v) => handleInputChange("condition", v)} disabled={isLoading}>
                        <SelectTrigger id="v-condition">
                            <SelectValue placeholder="Select condition" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="new">New</SelectItem>
                            <SelectItem value="used">Used</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <Label htmlFor="v-price">Price (KES) *</Label>
                    <Input
                        id="v-price"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={formData.price}
                        onChange={(e) => handleInputChange("price", e.target.value)}
                        disabled={isLoading}
                    />
                </div>
            </div>

            <div>
                <Label htmlFor="v-vin">VIN (Optional)</Label>
                <Input
                    id="v-vin"
                    placeholder="Vehicle Identification Number"
                    value={formData.vin}
                    onChange={(e) => handleInputChange("vin", e.target.value)}
                    disabled={isLoading}
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
                    <DialogTitle>Add Vehicle Listing</DialogTitle>
                    <DialogDescription>Enter vehicle details and specifications</DialogDescription>
                </DialogHeader>
                {fields}
                {footer}
            </DialogContent>
        </Dialog>
    )
})