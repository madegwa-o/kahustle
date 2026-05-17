// components/vehicles/property-filters.tsx
"use client"
import { Search, SlidersHorizontal, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"

const ALL = "__all__"
const toValue = (v: string | null) => v || ALL
const fromValue = (v: string) => v === ALL ? "" : v

interface Props {
    values: URLSearchParams
    onChange: (key: string, value: string) => void
}

export default function PropertyFilters({ values, onChange }: Props) {
    const hasFilters = ["search", "make", "fuelType", "transmission", "condition", "minPrice", "maxPrice"].some(k => values.get(k))

    return (
        <div className="mb-6 space-y-3">
            <div className="flex gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    <Input
                        placeholder="Search make, model..."
                        defaultValue={values.get("search") ?? ""}
                        onBlur={(e) => onChange("search", e.target.value)}
                        className="pl-9"
                    />
                </div>
                <Input
                    placeholder="Make"
                    defaultValue={values.get("make") ?? ""}
                    onBlur={(e) => onChange("make", e.target.value)}
                    className="w-32 hidden sm:block"
                />
                <Select value={values.get("sort") ?? "newest"} onValueChange={(v) => onChange("sort", v)}>
                    <SelectTrigger className="w-44">
                        <SlidersHorizontal className="h-4 w-4 mr-2 text-muted-foreground" />
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="newest">Newest first</SelectItem>
                        <SelectItem value="oldest">Oldest first</SelectItem>
                        <SelectItem value="lowest-price">Price: low to high</SelectItem>
                        <SelectItem value="highest-price">Price: high to low</SelectItem>
                        <SelectItem value="lowest-mileage">Lowest mileage</SelectItem>
                        <SelectItem value="highest-mileage">Highest mileage</SelectItem>
                        <SelectItem value="newest-year">Newest year</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="flex flex-wrap gap-2">
                <Select value={toValue(values.get("fuelType"))} onValueChange={(v) => onChange("fuelType", fromValue(v))}>
                    <SelectTrigger className="w-32 h-8 text-xs"><SelectValue placeholder="Fuel type" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value={ALL}>All fuel types</SelectItem>
                        <SelectItem value="petrol">Petrol</SelectItem>
                        <SelectItem value="diesel">Diesel</SelectItem>
                        <SelectItem value="hybrid">Hybrid</SelectItem>
                        <SelectItem value="electric">Electric</SelectItem>
                    </SelectContent>
                </Select>

                <Select value={toValue(values.get("transmission"))} onValueChange={(v) => onChange("transmission", fromValue(v))}>
                    <SelectTrigger className="w-36 h-8 text-xs"><SelectValue placeholder="Transmission" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value={ALL}>All transmissions</SelectItem>
                        <SelectItem value="automatic">Automatic</SelectItem>
                        <SelectItem value="manual">Manual</SelectItem>
                    </SelectContent>
                </Select>

                <Select value={toValue(values.get("condition"))} onValueChange={(v) => onChange("condition", fromValue(v))}>
                    <SelectTrigger className="w-28 h-8 text-xs"><SelectValue placeholder="Condition" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value={ALL}>All conditions</SelectItem>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="used">Used</SelectItem>
                    </SelectContent>
                </Select>

                <div className="flex items-center gap-1">
                    <Input placeholder="Min KES" type="number" defaultValue={values.get("minPrice") ?? ""} onBlur={(e) => onChange("minPrice", e.target.value)} className="w-28 h-8 text-xs" />
                    <span className="text-muted-foreground text-xs">–</span>
                    <Input placeholder="Max KES" type="number" defaultValue={values.get("maxPrice") ?? ""} onBlur={(e) => onChange("maxPrice", e.target.value)} className="w-28 h-8 text-xs" />
                </div>

                {hasFilters && (
                    <Button variant="ghost" size="sm" className="h-8 text-xs text-muted-foreground"
                            onClick={() => ["search","make","fuelType","transmission","condition","minPrice","maxPrice"].forEach(k => onChange(k, ""))}>
                        <X className="h-3 w-3 mr-1" />Clear filters
                    </Button>
                )}
            </div>
        </div>
    )
}