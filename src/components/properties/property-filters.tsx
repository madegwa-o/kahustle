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
  const filterKeys = ["search", "city", "propertyType", "condition", "minBedrooms", "minBathrooms", "minPrice", "maxPrice"]
  const hasFilters = filterKeys.some((key) => values.get(key))

  return (
    <div className="mb-6 space-y-3">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search properties..."
            defaultValue={values.get("search") ?? ""}
            onBlur={(e) => onChange("search", e.target.value)}
            className="pl-9"
          />
        </div>
        <Input
          placeholder="City"
          defaultValue={values.get("city") ?? ""}
          onBlur={(e) => onChange("city", e.target.value)}
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
            <SelectItem value="most-bedrooms">Most bedrooms</SelectItem>
            <SelectItem value="largest">Largest first</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-wrap gap-2">
        <Select value={toValue(values.get("propertyType"))} onValueChange={(v) => onChange("propertyType", fromValue(v))}>
          <SelectTrigger className="w-40 h-8 text-xs"><SelectValue placeholder="Property type" /></SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All property types</SelectItem>
            <SelectItem value="residential">Residential</SelectItem>
            <SelectItem value="commercial">Commercial</SelectItem>
            <SelectItem value="land">Land</SelectItem>
          </SelectContent>
        </Select>

        <Select value={toValue(values.get("condition"))} onValueChange={(v) => onChange("condition", fromValue(v))}>
          <SelectTrigger className="w-36 h-8 text-xs"><SelectValue placeholder="Condition" /></SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All conditions</SelectItem>
            <SelectItem value="excellent">Excellent</SelectItem>
            <SelectItem value="good">Good</SelectItem>
            <SelectItem value="fair">Fair</SelectItem>
            <SelectItem value="needs-repair">Needs repair</SelectItem>
          </SelectContent>
        </Select>

        <Input placeholder="Min beds" type="number" defaultValue={values.get("minBedrooms") ?? ""} onBlur={(e) => onChange("minBedrooms", e.target.value)} className="w-24 h-8 text-xs" />
        <Input placeholder="Min baths" type="number" defaultValue={values.get("minBathrooms") ?? ""} onBlur={(e) => onChange("minBathrooms", e.target.value)} className="w-24 h-8 text-xs" />

        <div className="flex items-center gap-1">
          <Input placeholder="Min KES" type="number" defaultValue={values.get("minPrice") ?? ""} onBlur={(e) => onChange("minPrice", e.target.value)} className="w-28 h-8 text-xs" />
          <span className="text-muted-foreground text-xs">–</span>
          <Input placeholder="Max KES" type="number" defaultValue={values.get("maxPrice") ?? ""} onBlur={(e) => onChange("maxPrice", e.target.value)} className="w-28 h-8 text-xs" />
        </div>

        {hasFilters && (
          <Button variant="ghost" size="sm" className="h-8 text-xs text-muted-foreground" onClick={() => filterKeys.forEach((key) => onChange(key, ""))}>
            <X className="h-3 w-3 mr-1" />Clear filters
          </Button>
        )}
      </div>
    </div>
  )
}
