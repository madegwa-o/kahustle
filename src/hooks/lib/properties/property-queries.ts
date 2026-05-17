import { FilterQuery } from "mongoose"
import { IProperty } from "@/models/Property"
const toNumber=(v:string|null,f:number)=>{const n=Number(v);return Number.isFinite(n)?n:f}
const esc=(s:string)=>s.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")
export const normalizePropertyPagination=(p:URLSearchParams)=>{const page=Math.max(1,toNumber(p.get("page"),1));const limit=Math.min(50,Math.max(1,toNumber(p.get("limit"),20)));return{page,limit,skip:(page-1)*limit}}
export const propertySortToMongo=(s:string|null)=>s==="lowest-price"?{price:1}:s==="highest-price"?{price:-1}:{createdAt:-1}
export function buildPropertyQuery(sp:URLSearchParams):FilterQuery<IProperty>{const f:FilterQuery<IProperty>={status:"active"};const city=sp.get("city");if(city)f.city=new RegExp(esc(city),"i") as never;const condition=sp.get("condition");if(condition)f.condition=condition as never;const sub=sp.get("subcategory");if(sub)f.propertyType=new RegExp(esc(sub),"i") as never;const min=sp.get("minPrice");const max=sp.get("maxPrice");if(min||max)f.price={...(min?{$gte:Number(min)}:{}),...(max?{$lte:Number(max)}:{})};return f}
