"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type Category = { _id: string; mainCategory: string; subcategories: string[] }

export default function AccountCategoriesTab() {
  const { data: session } = useSession()
  const canManage = session?.user?.roles?.includes("EDITOR") || session?.user?.roles?.includes("ADMIN")
  const [categories, setCategories] = useState<Category[]>([])
  const [mainCategory, setMainCategory] = useState("")
  const [subcategories, setSubcategories] = useState("")

  const load = async () => {
    const res = await fetch("/api/categories")
    const data = await res.json()
    setCategories(data.categories || [])
  }

  useEffect(() => {
    if (!canManage) return
    void fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data.categories || []))
  }, [canManage])

  const createCategory = async () => {
    const subs = subcategories.split(",").map((s) => s.trim()).filter(Boolean)
    await fetch("/api/categories", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ mainCategory, subcategories: subs }) })
    setMainCategory("")
    setSubcategories("")
    load()
  }

  const updateCategory = async (id: string, subs: string[]) => {
    await fetch(`/api/categories/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ subcategories: subs }) })
    load()
  }

  const deleteCategory = async (id: string) => {
    await fetch(`/api/categories/${id}`, { method: "DELETE" })
    load()
  }

  if (!canManage) return <p className="text-sm text-muted-foreground">Only staff can manage categories.</p>

  return <div className="space-y-4">
    <div className="border rounded p-3 space-y-2">
      <p className="text-sm font-medium">Add Category</p>
      <Input placeholder="Main category (e.g. VEHICLES)" value={mainCategory} onChange={(e) => setMainCategory(e.target.value)} />
      <Input placeholder="Subcategories comma separated" value={subcategories} onChange={(e) => setSubcategories(e.target.value)} />
      <Button size="sm" onClick={createCategory}>Create Category</Button>
    </div>
    {categories.map((c) => (
      <div key={c._id} className="border rounded p-3 flex flex-col gap-2">
        <p className="font-medium">{c.mainCategory}</p>
        <Input defaultValue={c.subcategories.join(", ")} onBlur={(e) => updateCategory(c._id, e.target.value.split(",").map((s) => s.trim()).filter(Boolean))} />
        <Button size="sm" variant="destructive" onClick={() => deleteCategory(c._id)}>Delete</Button>
      </div>
    ))}
  </div>
}
