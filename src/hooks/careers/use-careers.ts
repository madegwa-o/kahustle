"use client"
import useSWR from "swr"

const fetcher = (u: string) => fetch(u).then((r) => r.json())

export function useCareers(query: string) {
  const { data, error, isLoading, mutate } = useSWR(`/api/jobs?${query}`, fetcher)
  return { items: data?.items || [], pagination: data?.pagination, error, isLoading, mutate }
}
