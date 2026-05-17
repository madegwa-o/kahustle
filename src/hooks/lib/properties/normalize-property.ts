import { IProperty } from "@/models/Property"
import { Types } from "mongoose"
type SellerShape={_id?:{toString():string};name?:string;email?:string;phone?:string;location?:string}
export type AnyProperty=Partial<IProperty>&{_id:Types.ObjectId|{toString():string}|string;userId?:SellerShape}
export function normalizePropertyListing(p:AnyProperty){const id=typeof p._id==="string"?p._id:p._id.toString();return{id,name:p.name,price:p.price,currency:"KES",image:p.images?.[0]||null,city:p.city,propertyType:p.propertyType,bedrooms:p.bedrooms,bathrooms:p.bathrooms,condition:p.condition,createdAt:p.createdAt,detailUrl:`/properties/listing/${id}`,status:p.status}}
export function normalizePropertyDetail(p:AnyProperty,can:boolean,related:AnyProperty[]=[]){const seller=p.userId&&typeof p.userId==="object"?{id:p.userId._id?.toString?.()||"",name:p.userId.name,...(can?{email:p.userId.email,phone:p.userId.phone}:{})}:null;return{...normalizePropertyListing(p),description:p.description||"",images:p.images||[],squareFeet:p.squareFeet,address:p.address,state:p.state,postalCode:p.postalCode,amenities:p.amenities||[],yearBuilt:p.yearBuilt,parking:p.parking,seller,relatedProperties:related.map(normalizePropertyListing)}}
export type PropertyListing=ReturnType<typeof normalizePropertyListing>
export type PropertyDetail=ReturnType<typeof normalizePropertyDetail>
