"use client"
import useSWR from "swr"
import { ConstructionListing } from "@/lib/construction-freelancers/types"

type Pagination = {
  page: number
  limit: number
  total: number
  pages: number
}

type Response = {
  data: ConstructionListing[]
  pagination: Pagination
}

const fetcher = async (url: string) => {
  const res = await fetch(url)
  const json = await res.json()
  if (!json.success) throw new Error(json.error)
  return json
}

export function useConstructionServices(queryString: string) {
  const { data, error, isLoading, mutate } = useSWR<Response>(`/api/construction-services?${queryString}`, fetcher, { keepPreviousData: true })
  return {
    services: data?.data ?? [],
    pagination: data?.pagination ?? null,
    loading: isLoading,
    error,
    mutate,
  }
}
