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

interface CreateJobFormProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSubmit: (data: any) => Promise<void>
    isLoading?: boolean
    inline?: boolean
}

export const CreateJobForm = memo(function CreateJobForm({
                                                             open,
                                                             onOpenChange,
                                                             onSubmit,
                                                             isLoading = false,
                                                             inline = false,
                                                         }: CreateJobFormProps) {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        jobTitle: "",
        company: "",
        industry: "",
        employmentType: "",
        location: "",
        remote: false,
        salaryMin: "",
        salaryMax: "",
        currency: "KES",
        responsibilities: [] as string[],
        responsibilityInput: "",
        qualifications: [] as string[],
        qualificationInput: "",
        benefits: [] as string[],
        benefitInput: "",
        deadline: "",
    })

    const handleInputChange = (field: string, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    const handleAddItem = (type: "responsibilities" | "qualifications" | "benefits") => {
        const inputField = `${type.slice(0, -1)}Input` as keyof typeof formData
        const inputValue = formData[inputField] as string
        if (inputValue.trim()) {
            setFormData((prev) => ({
                ...prev,
                [type]: [...prev[type], inputValue.trim()],
                [inputField]: "",
            }))
        }
    }

    const handleRemoveItem = (type: "responsibilities" | "qualifications" | "benefits", index: number) => {
        setFormData((prev) => ({ ...prev, [type]: prev[type].filter((_, i) => i !== index) }))
    }

    const resetForm = () => {
        setFormData({
            name: "",
            description: "",
            price: "",
            jobTitle: "",
            company: "",
            industry: "",
            employmentType: "",
            location: "",
            remote: false,
            salaryMin: "",
            salaryMax: "",
            currency: "KES",
            responsibilities: [],
            responsibilityInput: "",
            qualifications: [],
            qualificationInput: "",
            benefits: [],
            benefitInput: "",
            deadline: "",
        })
    }

    const handleSubmit = async () => {
        const requiredFields = ["name", "jobTitle", "company", "industry", "employmentType", "location", "salaryMin", "salaryMax"]
        if (requiredFields.some((f) => !formData[f as keyof typeof formData])) return

        await onSubmit({
            name: formData.name,
            description: formData.description,
            price: formData.price ? parseFloat(formData.price) : 0,
            jobTitle: formData.jobTitle,
            company: formData.company,
            industry: formData.industry,
            employmentType: formData.employmentType,
            location: formData.location,
            remote: formData.remote,
            salaryMin: parseFloat(formData.salaryMin),
            salaryMax: parseFloat(formData.salaryMax),
            currency: formData.currency,
            responsibilities: formData.responsibilities,
            qualifications: formData.qualifications,
            benefits: formData.benefits,
            deadline: formData.deadline ? new Date(formData.deadline).toISOString() : undefined,
            images: [],
        })

        resetForm()
        if (!inline) onOpenChange(false)
    }

    const isFormValid =
        formData.name && formData.jobTitle && formData.company && formData.industry &&
        formData.employmentType && formData.location && formData.salaryMin && formData.salaryMax

    const TagList = ({
                         type,
                         items,
                         inputValue,
                         inputField,
                         placeholder,
                     }: {
        type: "responsibilities" | "qualifications" | "benefits"
        items: string[]
        inputValue: string
        inputField: string
        placeholder: string
    }) => (
        <div>
            <Label className="capitalize">{type}</Label>
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
                <Label htmlFor="j-name">Job Posting Title *</Label>
                <Input
                    id="j-name"
                    placeholder="Senior Software Engineer Position"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    disabled={isLoading}
                />
            </div>

            <div>
                <Label htmlFor="j-description">Description</Label>
                <Textarea
                    id="j-description"
                    placeholder="Job description..."
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    disabled={isLoading}
                    rows={3}
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="j-title">Job Title *</Label>
                    <Input
                        id="j-title"
                        placeholder="Senior Software Engineer"
                        value={formData.jobTitle}
                        onChange={(e) => handleInputChange("jobTitle", e.target.value)}
                        disabled={isLoading}
                    />
                </div>
                <div>
                    <Label htmlFor="j-company">Company *</Label>
                    <Input
                        id="j-company"
                        placeholder="Acme Ltd"
                        value={formData.company}
                        onChange={(e) => handleInputChange("company", e.target.value)}
                        disabled={isLoading}
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="j-industry">Industry *</Label>
                    <Input
                        id="j-industry"
                        placeholder="Technology"
                        value={formData.industry}
                        onChange={(e) => handleInputChange("industry", e.target.value)}
                        disabled={isLoading}
                    />
                </div>
                <div>
                    <Label htmlFor="j-type">Employment Type *</Label>
                    <Select value={formData.employmentType} onValueChange={(v) => handleInputChange("employmentType", v)} disabled={isLoading}>
                        <SelectTrigger id="j-type">
                            <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="full-time">Full-time</SelectItem>
                            <SelectItem value="part-time">Part-time</SelectItem>
                            <SelectItem value="contract">Contract</SelectItem>
                            <SelectItem value="temporary">Temporary</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="j-location">Location *</Label>
                    <Input
                        id="j-location"
                        placeholder="Nairobi, Kenya"
                        value={formData.location}
                        onChange={(e) => handleInputChange("location", e.target.value)}
                        disabled={isLoading}
                    />
                </div>
                <div className="flex items-end pb-1">
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                        <input
                            type="checkbox"
                            checked={formData.remote}
                            onChange={(e) => handleInputChange("remote", e.target.checked)}
                            disabled={isLoading}
                            className="rounded"
                        />
                        Remote Available
                    </label>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
                <div>
                    <Label htmlFor="j-salarymin">Min Salary *</Label>
                    <Input
                        id="j-salarymin"
                        type="number"
                        placeholder="50000"
                        value={formData.salaryMin}
                        onChange={(e) => handleInputChange("salaryMin", e.target.value)}
                        disabled={isLoading}
                    />
                </div>
                <div>
                    <Label htmlFor="j-salarymax">Max Salary *</Label>
                    <Input
                        id="j-salarymax"
                        type="number"
                        placeholder="100000"
                        value={formData.salaryMax}
                        onChange={(e) => handleInputChange("salaryMax", e.target.value)}
                        disabled={isLoading}
                    />
                </div>
                <div>
                    <Label htmlFor="j-currency">Currency</Label>
                    <Input
                        id="j-currency"
                        placeholder="KES"
                        value={formData.currency}
                        onChange={(e) => handleInputChange("currency", e.target.value)}
                        disabled={isLoading}
                    />
                </div>
            </div>

            <div>
                <Label htmlFor="j-deadline">Application Deadline (Optional)</Label>
                <Input
                    id="j-deadline"
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => handleInputChange("deadline", e.target.value)}
                    disabled={isLoading}
                />
            </div>

            <TagList
                type="responsibilities"
                items={formData.responsibilities}
                inputValue={formData.responsibilityInput}
                inputField="responsibilityInput"
                placeholder="Add responsibility..."
            />
            <TagList
                type="qualifications"
                items={formData.qualifications}
                inputValue={formData.qualificationInput}
                inputField="qualificationInput"
                placeholder="Add qualification..."
            />
            <TagList
                type="benefits"
                items={formData.benefits}
                inputValue={formData.benefitInput}
                inputField="benefitInput"
                placeholder="Add benefit..."
            />
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
                    <DialogTitle>Add Job Listing</DialogTitle>
                    <DialogDescription>Enter job details and requirements</DialogDescription>
                </DialogHeader>
                {fields}
                {footer}
            </DialogContent>
        </Dialog>
    )
})