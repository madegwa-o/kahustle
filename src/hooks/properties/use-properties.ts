"use client"
import useSWR from "swr"
import { PropertyListing } from "@/lib/properties/types"
const fetcher=async(url:string)=>{const r=await fetch(url);const j=await r.json();if(!j.success)throw new Error(j.error);return j}
export function useProperties(queryString:string){const {data,error,isLoading}=useSWR<{data:PropertyListing[];pagination:{page:number;limit:number;total:number;pages:number}}>(`/api/properties?${queryString}`,fetcher,{keepPreviousData:true});return{properties:data?.data??[],pagination:data?.pagination??null,loading:isLoading,error}}
