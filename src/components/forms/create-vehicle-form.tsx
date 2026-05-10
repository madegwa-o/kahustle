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
}

export const CreateVehicleForm = memo(function CreateVehicleForm({
    open,
    onOpenChange,
    onSubmit,
    isLoading = false,
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
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }))
    }

    const handleSubmit = async () => {
        const requiredFields = ["name", "price", "make", "vehicleModel", "year", "mileage", "fuelType", "transmission", "bodyType", "color", "condition"]
        if (requiredFields.some((field) => !formData[field as keyof typeof formData])) {
            return
        }

        await onSubmit({
            ...formData,
            price: parseFloat(formData.price),
            year: parseInt(formData.year),
            mileage: parseFloat(formData.mileage),
            images: [],
        })

        // Reset form
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
        onOpenChange(false)
    }

    const isFormValid = formData.name && formData.price && formData.make && formData.vehicleModel && formData.year && formData.mileage && formData.fuelType && formData.transmission && formData.bodyType && formData.color && formData.condition

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Add Vehicle Listing</DialogTitle>
                    <DialogDescription>Enter vehicle details and specifications</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
                    <div>
                        <Label htmlFor="name">Vehicle Name/Title *</Label>
                        <Input
                            id="name"
                            placeholder="2022 Honda Civic"
                            value={formData.name}
                            onChange={(e) => handleInputChange("name", e.target.value)}
                            disabled={isLoading}
                        />
                    </div>

                    <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            placeholder="Additional details about the vehicle..."
                            value={formData.description}
                            onChange={(e) => handleInputChange("description", e.target.value)}
                            disabled={isLoading}
                            rows={3}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="make">Make *</Label>
                            <Input
                                id="make"
                                placeholder="Honda"
                                value={formData.make}
                                onChange={(e) => handleInputChange("make", e.target.value)}
                                disabled={isLoading}
                            />
                        </div>
                        <div>
                            <Label htmlFor="vehicleModel">Model *</Label>
                            <Input
                                id="vehicleModel"
                                placeholder="Civic"
                                value={formData.vehicleModel}
                                onChange={(e) => handleInputChange("vehicleModel", e.target.value)}
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="year">Year *</Label>
                            <Input
                                id="year"
                                type="number"
                                placeholder="2022"
                                value={formData.year}
                                onChange={(e) => handleInputChange("year", e.target.value)}
                                disabled={isLoading}
                            />
                        </div>
                        <div>
                            <Label htmlFor="mileage">Mileage (km) *</Label>
                            <Input
                                id="mileage"
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
                            <Label htmlFor="fuelType">Fuel Type *</Label>
                            <Select value={formData.fuelType} onValueChange={(value) => handleInputChange("fuelType", value)} disabled={isLoading}>
                                <SelectTrigger>
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
                            <Label htmlFor="transmission">Transmission *</Label>
                            <Select value={formData.transmission} onValueChange={(value) => handleInputChange("transmission", value)} disabled={isLoading}>
                                <SelectTrigger>
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
                            <Label htmlFor="bodyType">Body Type *</Label>
                            <Input
                                id="bodyType"
                                placeholder="Sedan"
                                value={formData.bodyType}
                                onChange={(e) => handleInputChange("bodyType", e.target.value)}
                                disabled={isLoading}
                            />
                        </div>
                        <div>
                            <Label htmlFor="color">Color *</Label>
                            <Input
                                id="color"
                                placeholder="Black"
                                value={formData.color}
                                onChange={(e) => handleInputChange("color", e.target.value)}
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="condition">Condition *</Label>
                            <Select value={formData.condition} onValueChange={(value) => handleInputChange("condition", value)} disabled={isLoading}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select condition" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="new">New</SelectItem>
                                    <SelectItem value="used">Used</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="price">Price *</Label>
                            <Input
                                id="price"
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
                        <Label htmlFor="vin">VIN (Optional)</Label>
                        <Input
                            id="vin"
                            placeholder="Vehicle Identification Number"
                            value={formData.vin}
                            onChange={(e) => handleInputChange("vin", e.target.value)}
                            disabled={isLoading}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={isLoading || !isFormValid}>
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Creating...
                            </>
                        ) : (
                            "Create Listing"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
})
