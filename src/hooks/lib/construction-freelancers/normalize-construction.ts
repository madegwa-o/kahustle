import { IConstructionService } from "@/models/ConstructionService"
import { Types } from "mongoose"
type SellerShape={_id?:{toString():string};name?:string;email?:string;phone?:string;location?:string}
export type AnyConstructionService=Partial<IConstructionService>&{_id:Types.ObjectId|{toString():string}|string;userId?:SellerShape}
export function normalizeConstructionListing(s:AnyConstructionService){const id=typeof s._id==="string"?s._id:s._id.toString();return{id,name:s.name,price:s.price,currency:"KES",image:s.images?.[0]||null,category:s.category,availability:s.availability,serviceArea:s.serviceArea||[],yearsOfExperience:s.yearsOfExperience,createdAt:s.createdAt,detailUrl:`/construction-freelancers/listing/${id}`,status:s.status}}
export function normalizeConstructionDetail(s:AnyConstructionService,can:boolean,related:AnyConstructionService[]=[]){const freelancer=s.userId&&typeof s.userId==="object"?{id:s.userId._id?.toString?.()||"",name:s.userId.name,location:s.userId.location,...(can?{email:s.userId.email,phone:s.userId.phone}:{})}:null;return{...normalizeConstructionListing(s),description:s.description||"",images:s.images||[],skills:s.expertise||[],license:s.license,insurance:s.insurance,priceType:s.priceType,certifications:s.certifications||[],previousProjects:s.previousProjects,freelancer,relatedFreelancers:related.map(normalizeConstructionListing)}}
export type ConstructionListing=ReturnType<typeof normalizeConstructionListing>
export type ConstructionDetail=ReturnType<typeof normalizeConstructionDetail>
