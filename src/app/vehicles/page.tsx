"use client"
import { useMemo, useState } from "react"
import VehicleFilters from "@/components/vehicles/vehicle-filters"
import VehiclesGrid from "@/components/vehicles/vehicles-grid"
import { useVehicles } from "@/hooks/vehicles/use-vehicles"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import {CreateVehicleForm} from "@/components/forms/create-vehicle-form";
import {canCreateVehicle} from "@/lib/vehicles/vehicle-permissions";
import {useSession} from "next-auth/react";

export default function VehiclesPage() {
  const [params, setParams] = useState(new URLSearchParams({ page: "1", limit: "20", sort: "newest" }))
  const query = useMemo(() => params.toString(), [params])
  const { vehicles, pagination, loading, error,mutate } = useVehicles(query)
    const [openCreate, setOpenCreate] = useState(false)
    const [isCreating, setIsCreating] = useState(false)

    const { data: Session} = useSession()


    const canPost = canCreateVehicle(Session?.user)
  const onChange = (key: string, value: string) => {
    const next = new URLSearchParams(params)
    if (!value) next.delete(key)
    else next.set(key, value)
    if (key !== "page") next.set("page", "1")
    setParams(next)
  }

    const handleCreate = async (data: unknown) => {
        setIsCreating(true)
        try {
            const res = await fetch("/api/vehicles", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            })
            if (!res.ok) {
                throw new Error("Failed to create listing")
            }
            setOpenCreate(false)
            await mutate()
        } finally {
            setIsCreating(false)
        }
    }


    return (
      <main className="mx-auto max-w-7xl px-4 py-8">

          <div className="flex items-center justify-between gap-3">
              <div className="mb-6">
                  <h1 className="text-3xl font-bold text-foreground">Vehicles</h1>
                  <p className="text-muted-foreground mt-1">Browse vehicles for sale across Kenya</p>
              </div>
              {canPost ? (
                  <Button onClick={() => setOpenCreate(true)}>Post Car</Button>
              ) : (
                  <Button asChild variant="outline"><a href="/account">Become a Car dealer to Post</a></Button>
              )}
          </div>

        <VehicleFilters values={params} onChange={onChange} />

        {loading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-72 rounded-xl bg-muted animate-pulse" />
              ))}
            </div>
        ) : error ? (
            <div className="py-16 text-center text-muted-foreground">Failed to load vehicles. Please try again.</div>
        ) : vehicles.length === 0 ? (
            <div className="py-16 text-center text-muted-foreground">No vehicles found matching your filters.</div>
        ) : (
            <VehiclesGrid vehicles={vehicles} />
        )}

        {pagination && pagination.pages > 1 && (
            <div className="mt-8 flex items-center justify-between">
              <Button variant="outline" size="sm" disabled={pagination.page <= 1}
                      onClick={() => onChange("page", String(pagination.page - 1))}>
                <ChevronLeft className="h-4 w-4 mr-1" />Previous
              </Button>
              <span className="text-sm text-muted-foreground">
            Page {pagination.page} of {pagination.pages} · {pagination.total.toLocaleString()} vehicles
          </span>
              <Button variant="outline" size="sm" disabled={pagination.page >= pagination.pages}
                      onClick={() => onChange("page", String(pagination.page + 1))}>
                Next<ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
        )}

          {canPost ? (
              <CreateVehicleForm
                  open={openCreate}
                  onOpenChange={setOpenCreate}
                  onSubmit={handleCreate}
                  isLoading={isCreating}
              />
          ) : null}
      </main>
  )
}