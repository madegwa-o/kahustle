"use client"

import { useEffect, useMemo, useState } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const MAIN_CATEGORIES = ["VEHICLES", "CONSTRUCTION_FREELANCERS", "CAREERS", "PROPERTIES"] as const

type Category = { _id: string; mainCategory: string; subcategories: string[] }

export default function AccountCategoriesTab() {
  const { data: session } = useSession()
  const canManage = useMemo(
    () => session?.user?.roles?.includes("EDITOR") || session?.user?.roles?.includes("ADMIN"),
    [session?.user?.roles]
  )

  const [categories, setCategories] = useState<Category[]>([])
  const [subcategoryInputs, setSubcategoryInputs] = useState<Record<string, string>>({})

  const load = async () => {
    const res = await fetch("/api/categories")
    const data = await res.json()
    setCategories(data.categories || [])
  }

  useEffect(() => {
    if (!canManage) return
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load()
  }, [canManage])

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
    const next = category.subcategories.map((item) => (item === currentName ? sanitized : item))
    await saveSubcategories(category._id, Array.from(new Set(next)))
  }

  const addSubcategory = async (category: Category) => {
    const newSubcategory = (subcategoryInputs[category._id] || "").trim()
    if (!newSubcategory || category.subcategories.includes(newSubcategory)) return
    await saveSubcategories(category._id, [...category.subcategories, newSubcategory])
    setSubcategoryInputs((prev) => ({ ...prev, [category._id]: "" }))
  }

  if (!canManage) return <p className="text-sm text-muted-foreground">Only staff can manage categories.</p>

  const categoriesByMain = MAIN_CATEGORIES.map((mainCategory) =>
    categories.find((category) => category.mainCategory === mainCategory)
  ).filter(Boolean) as Category[]

  return <div className="space-y-4">
    <p className="text-sm text-muted-foreground">Manage subcategories under the 4 supported platform categories.</p>

    {categoriesByMain.map((category) => (
      <div key={category._id} className="border rounded p-3 flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <p className="font-medium">{category.mainCategory}</p>
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
