"use client"
import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { CreateJobForm } from "@/components/forms/create-job-form"
import CareerFilters from "@/components/careers/career-filters"
import CareersGrid from "@/components/careers/careers-grid"
import { useCareers } from "@/hooks/careers/use-careers"
import { canCreateCareer } from "@/lib/careers/career-permissions"

export default function CareersPage() {
  const sp = useSearchParams()
  const { data: session } = useSession()
  const { items, pagination, isLoading, mutate } = useCareers(sp.toString())
  const [openCreate, setOpenCreate] = useState(false)
  const [isCreating, setIsCreating] = useState(false)

  const canPost = canCreateCareer(session?.user)

  const handleCreate = async (data: unknown) => {
    setIsCreating(true)
    try {
      const res = await fetch("/api/jobs", {
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
    <main className="container mx-auto px-4 py-8 space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-3xl font-bold">Careers</h1>
        {canPost ? (
          <Button onClick={() => setOpenCreate(true)}>Post Job</Button>
        ) : (
          <Button asChild variant="outline"><a href="/account">Become a Recruiter to Post</a></Button>
        )}
      </div>
      <CareerFilters />
      {isLoading ? <p>Loading...</p> : items.length ? <CareersGrid items={items} /> : <p>No jobs found.</p>}
      {pagination ? <p className="text-sm">Page {pagination.page} of {pagination.totalPages}</p> : null}

      {canPost ? (
        <CreateJobForm
          open={openCreate}
          onOpenChange={setOpenCreate}
          onSubmit={handleCreate}
          isLoading={isCreating}
        />
      ) : null}
    </main>
  )
}
