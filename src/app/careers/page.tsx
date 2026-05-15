"use client"
import { useSearchParams } from "next/navigation"
import CareerFilters from "@/components/careers/career-filters"
import CareersGrid from "@/components/careers/careers-grid"
import { useCareers } from "@/hooks/use-careers"

export default function CareersPage() {
  const sp = useSearchParams()
  const { items, pagination, isLoading } = useCareers(sp.toString())

  return <main className="container mx-auto px-4 py-8 space-y-4"><h1 className="text-3xl font-bold">Careers</h1><CareerFilters />{isLoading ? <p>Loading...</p> : items.length ? <CareersGrid items={items} /> : <p>No jobs found.</p>}{pagination ? <p className="text-sm">Page {pagination.page} of {pagination.totalPages}</p> : null}</main>
}
