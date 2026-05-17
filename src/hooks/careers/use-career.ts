"use client"
import useSWR from "swr"
const fetcher = (u: string) => fetch(u).then((r) => r.json())
export function useCareer(id: string) { const { data, error, isLoading } = useSWR(id ? `/api/jobs/${id}` : null, fetcher); return { item: data?.item, error, isLoading } }
