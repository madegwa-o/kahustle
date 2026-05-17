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

export default function ConstructionServiceFilters({ values, onChange }: Props) {
  const filterKeys = ["search", "category", "serviceArea", "availability", "minExperience", "minPrice", "maxPrice"]
  const hasFilters = filterKeys.some((key) => values.get(key))

  return (
    <div className="mb-6 space-y-3">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search construction freelancers..."
            defaultValue={values.get("search") ?? ""}
            onBlur={(e) => onChange("search", e.target.value)}
            className="pl-9"
          />
        </div>
        <Input
          placeholder="Service area"
          defaultValue={values.get("serviceArea") ?? ""}
          onBlur={(e) => onChange("serviceArea", e.target.value)}
          className="w-36 hidden sm:block"
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
            <SelectItem value="most-experience">Most experienced</SelectItem>
            <SelectItem value="most-projects">Most projects</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-wrap gap-2">
        <Input
          placeholder="Category"
          defaultValue={values.get("category") ?? ""}
          onBlur={(e) => onChange("category", e.target.value)}
          className="w-32 h-8 text-xs"
        />

        <Select value={toValue(values.get("availability"))} onValueChange={(v) => onChange("availability", fromValue(v))}>
          <SelectTrigger className="w-44 h-8 text-xs"><SelectValue placeholder="Availability" /></SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>Any availability</SelectItem>
            <SelectItem value="immediately">Immediately</SelectItem>
            <SelectItem value="within-2-weeks">Within 2 weeks</SelectItem>
            <SelectItem value="within-month">Within a month</SelectItem>
            <SelectItem value="flexible">Flexible</SelectItem>
          </SelectContent>
        </Select>

        <Input placeholder="Min years" type="number" defaultValue={values.get("minExperience") ?? ""} onBlur={(e) => onChange("minExperience", e.target.value)} className="w-24 h-8 text-xs" />

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
