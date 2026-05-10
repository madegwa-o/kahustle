"use client"

import { useEffect, useMemo, useState } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"
import { Role } from "@/lib/roles"

const MAIN_CATEGORIES = ["vehicles", "construction-freelancers", "careers", "properties"] as const

interface Subcategory {
  label: string
  slug: string
}

interface Category {
  _id: string
  mainCategory: string
  subcategories: Subcategory[]
}

function toSlug(label: string) {
  return label.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
}

export default function AccountCategoriesTab() {
  const { data: session, status } = useSession()

  const canManage = useMemo(
      () => session?.user?.roles?.includes(Role.STAFF) ?? false,
      [session?.user?.roles]
  )

  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [inputs, setInputs] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState<Record<string, boolean>>({})
  const [error, setError] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/categories")
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      setCategories(data.categories || [])
    } catch (err) {
      console.error("Failed to load categories:", err)
      setError("Failed to load categories. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (status === "loading") return
    if (!canManage) {
      setLoading(false)
      return
    }
    void load()
  }, [canManage, status])

  const saveSubcategories = async (id: string, subs: Subcategory[]) => {
    setSaving((prev) => ({ ...prev, [id]: true }))
    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subcategories: subs }),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      await load()
    } catch (err) {
      console.error("Failed to save subcategories:", err)
      setError("Failed to save changes. Please try again.")
    } finally {
      setSaving((prev) => ({ ...prev, [id]: false }))
    }
  }

  const addSubcategory = async (category: Category) => {
    const label = (inputs[category._id] || "").trim()
    if (!label) return
    const slug = toSlug(label)
    if (category.subcategories.some((s) => s.slug === slug)) return
    await saveSubcategories(category._id, [...category.subcategories, { label, slug }])
    setInputs((prev) => ({ ...prev, [category._id]: "" }))
  }

  const removeSubcategory = async (category: Category, slug: string) => {
    if (category.subcategories.length <= 1) return
    await saveSubcategories(
        category._id,
        category.subcategories.filter((s) => s.slug !== slug)
    )
  }

  const renameSubcategory = async (category: Category, slug: string, newLabel: string) => {
    const trimmed = newLabel.trim()
    if (!trimmed) return
    const updated = category.subcategories.map((s) =>
        s.slug === slug ? { label: trimmed, slug: toSlug(trimmed) } : s
    )
    await saveSubcategories(category._id, updated)
  }

  // Show spinner while session or data is loading
  if (status === "loading" || loading) {
    return (
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading categories...
        </div>
    )
  }

  if (!canManage) {
    return <p className="text-sm text-muted-foreground">Only staff can manage categories.</p>
  }

  if (error) {
    return (
        <div className="flex flex-col gap-2">
          <p className="text-sm text-destructive">{error}</p>
          <Button size="sm" variant="outline" onClick={load} className="w-fit">
            Retry
          </Button>
        </div>
    )
  }

  const categoriesByMain = MAIN_CATEGORIES
      .map((slug) => categories.find((c) => c.mainCategory === slug))
      .filter(Boolean) as Category[]

  return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Manage subcategories under the 4 supported platform categories.
        </p>

        {categoriesByMain.map((category) => (
            <div key={category._id} className="border rounded p-3 flex flex-col gap-3">
              <p className="font-medium capitalize">
                {category.mainCategory.replace(/-/g, " ")}
              </p>

              <div className="space-y-2">
                {category.subcategories.map((sub) => (
                    <div key={sub.slug} className="flex gap-2">
                      <Input
                          defaultValue={sub.label}
                          onBlur={(e) => {
                            if (e.target.value.trim() === sub.label) return
                            void renameSubcategory(category, sub.slug, e.target.value)
                          }}
                      />
                      <Button
                          size="sm"
                          variant="outline"
                          disabled={category.subcategories.length <= 1 || saving[category._id]}
                          onClick={() => removeSubcategory(category, sub.slug)}
                      >
                        Remove
                      </Button>
                    </div>
                ))}

                <div className="flex gap-2">
                  <Input
                      placeholder="Add a new subcategory"
                      value={inputs[category._id] || ""}
                      onChange={(e) =>
                          setInputs((prev) => ({ ...prev, [category._id]: e.target.value }))
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter") void addSubcategory(category)
                      }}
                  />
                  <Button
                      size="sm"
                      disabled={saving[category._id] || !inputs[category._id]?.trim()}
                      onClick={() => addSubcategory(category)}
                  >
                    {saving[category._id]
                        ? <Loader2 className="h-4 w-4 animate-spin" />
                        : "Add"
                    }
                  </Button>
                </div>
              </div>
            </div>
        ))}
      </div>
  )
}