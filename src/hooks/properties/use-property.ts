"use client"
import useSWR from "swr"
import { PropertyDetail } from "@/lib/properties/types"
const fetcher=(url:string)=>fetch(url).then(r=>r.json()).then(r=>{if(!r.success) throw new Error(r.error); return r.data})
export const useProperty=(id:string)=>{const {data,error,isLoading}=useSWR<PropertyDetail>(`/api/properties/${id}`,fetcher);return{property:data??null,loading:isLoading,error}}
