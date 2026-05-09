"use client"

import { useEffect, useMemo, useState } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type Category = { _id: string; mainCategory: string; subcategories: string[] }

export default function AccountCategoriesTab() {
  const { data: session } = useSession()
  const canManage = useMemo(
    () => session?.user?.roles?.includes("EDITOR") || session?.user?.roles?.includes("ADMIN"),
    [session?.user?.roles]
  )

  const [categories, setCategories] = useState<Category[]>([])
  const [mainCategory, setMainCategory] = useState("")
  const [subcategories, setSubcategories] = useState("")
  const [subcategoryInputs, setSubcategoryInputs] = useState<Record<string, string>>({})

  const load = async () => {
    const res = await fetch("/api/categories")
    const data = await res.json()
    setCategories(data.categories || [])
  }

  useEffect(() => {
    if (!canManage) return

    void (async () => {
      const res = await fetch("/api/categories")
      const data = await res.json()
      setCategories(data.categories || [])
    })()
  }, [canManage])

  const createCategory = async () => {
    const subs = subcategories.split(",").map((s) => s.trim()).filter(Boolean)
    await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mainCategory, subcategories: subs }),
    })
    setMainCategory("")
    setSubcategories("")
    await load()
  }

  const saveSubcategories = async (id: string, subs: string[]) => {
    await fetch(`/api/categories/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subcategories: subs }),
    })
    await load()
  }

  const removeSubcategory = async (category: Category, subcategory: string) => {
    const next = category.subcategories.filter((item) => item !== subcategory)
    if (next.length === 0) return
    await saveSubcategories(category._id, next)
  }

  const renameSubcategory = async (category: Category, currentName: string, nextName: string) => {
    const sanitized = nextName.trim()
    if (!sanitized) return

    const next = category.subcategories.map((item) =>
      item === currentName ? sanitized : item
    )
    await saveSubcategories(category._id, Array.from(new Set(next)))
  }

  const addSubcategory = async (category: Category) => {
    const newSubcategory = (subcategoryInputs[category._id] || "").trim()
    if (!newSubcategory) return
    if (category.subcategories.includes(newSubcategory)) return

    const next = [...category.subcategories, newSubcategory]
    await saveSubcategories(category._id, next)
    setSubcategoryInputs((prev) => ({ ...prev, [category._id]: "" }))
  }

  const deleteCategory = async (id: string) => {
    await fetch(`/api/categories/${id}`, { method: "DELETE" })
    await load()
  }

  if (!canManage) return <p className="text-sm text-muted-foreground">Only staff can manage categories.</p>

  return <div className="space-y-4">
    <div className="border rounded p-3 space-y-2">
      <p className="text-sm font-medium">Add Category</p>
      <Input placeholder="Main category (e.g. VEHICLES)" value={mainCategory} onChange={(e) => setMainCategory(e.target.value)} />
      <Input placeholder="Subcategories comma separated" value={subcategories} onChange={(e) => setSubcategories(e.target.value)} />
      <Button size="sm" onClick={createCategory}>Create Category</Button>
    </div>

    {categories.map((category) => (
      <div key={category._id} className="border rounded p-3 flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <p className="font-medium">{category.mainCategory}</p>
          <Button size="sm" variant="destructive" onClick={() => deleteCategory(category._id)}>Delete Category</Button>
        </div>

        <div className="space-y-2">
          {category.subcategories.map((subcategory) => (
            <div key={subcategory} className="flex gap-2">
              <Input
                defaultValue={subcategory}
                onBlur={(e) => {
                  if (e.target.value.trim() === subcategory) return
                  void renameSubcategory(category, subcategory, e.target.value)
                }}
              />
              <Button
                size="sm"
                variant="outline"
                onClick={() => removeSubcategory(category, subcategory)}
                disabled={category.subcategories.length <= 1}
              >
                Remove
              </Button>
            </div>
          ))}

          <div className="flex gap-2">
            <Input
              placeholder="Add a new subcategory"
              value={subcategoryInputs[category._id] || ""}
              onChange={(e) => setSubcategoryInputs((prev) => ({ ...prev, [category._id]: e.target.value }))}
            />
            <Button size="sm" onClick={() => addSubcategory(category)}>Add</Button>
          </div>
        </div>
      </div>
    ))}
  </div>
}
