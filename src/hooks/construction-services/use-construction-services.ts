"use client"
import useSWR from "swr"
import { ConstructionListing } from "@/lib/construction-freelancers/types"
const fetcher=async(url:string)=>{const r=await fetch(url);const j=await r.json();if(!j.success)throw new Error(j.error);return j}
export function useConstructionServices(queryString:string){const {data,error,isLoading}=useSWR<{data:ConstructionListing[];pagination:{page:number;limit:number;total:number;pages:number}}>(`/api/construction-services?${queryString}`,fetcher,{keepPreviousData:true});return{services:data?.data??[],pagination:data?.pagination??null,loading:isLoading,error}}
