"use client"
import useSWR from "swr"
import { PropertyListing } from "@/lib/properties/types"

type Pagination = {
  page: number
  limit: number
  total: number
  pages: number
}

type Response = {
  data: PropertyListing[]
  pagination: Pagination
}

const fetcher = async (url: string) => {
  const res = await fetch(url)
  const json = await res.json()
  if (!json.success) throw new Error(json.error)
  return json
}

export function useProperties(queryString: string) {
  const { data, error, isLoading, mutate } = useSWR<Response>(`/api/properties?${queryString}`, fetcher, { keepPreviousData: true })
  return {
    properties: data?.data ?? [],
    pagination: data?.pagination ?? null,
    loading: isLoading,
    error,
    mutate,
  }
}
