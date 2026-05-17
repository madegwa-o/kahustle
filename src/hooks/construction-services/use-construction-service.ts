"use client"
import useSWR from "swr"
import { ConstructionDetail } from "@/lib/construction-freelancers/types"
const fetcher=(url:string)=>fetch(url).then(r=>r.json()).then(r=>{if(!r.success) throw new Error(r.error); return r.data})
export const useConstructionService=(id:string)=>{const {data,error,isLoading}=useSWR<ConstructionDetail>(`/api/construction-services/${id}`,fetcher);return{service:data??null,loading:isLoading,error}}
