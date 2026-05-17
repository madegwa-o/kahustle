import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import { IProperty, Property } from "@/models/Property"
import { buildPropertyQuery, normalizePropertyPagination, propertySortToMongo } from "@/lib/properties/property-queries"
import { normalizePropertyListing } from "@/lib/properties/normalize-property"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { canCreateProperty } from "@/lib/properties/property-permissions"
const LISTING_FIELDS="name price images subcategory city propertyType bedrooms bathrooms condition createdAt status userId"
export async function GET(request:NextRequest){try{await connectToDatabase();const {searchParams}=new URL(request.url);const filter=buildPropertyQuery(searchParams);const {page,limit,skip}=normalizePropertyPagination(searchParams);const sort=propertySortToMongo(searchParams.get("sort"));const [properties,total]=await Promise.all([Property.find(filter).select(LISTING_FIELDS).sort(sort).skip(skip).limit(limit).lean<IProperty[]>(),Property.countDocuments(filter)]);return NextResponse.json({success:true,data:properties.map(normalizePropertyListing),pagination:{page,limit,total,pages:Math.ceil(total/limit)}})}catch(error){console.error(error);return NextResponse.json({success:false,error:"Failed to fetch properties"},{status:500})}}
export async function POST(request:NextRequest){const session=await getServerSession(authOptions);const user=session?.user?{_id:session.user.id??undefined,roles:session.user.roles}:null;if(!user?._id)return NextResponse.json({success:false,error:"Unauthorised"},{status:401});if(!canCreateProperty(user))return NextResponse.json({success:false,error:"Forbidden"},{status:403});await connectToDatabase();const body=await request.json();const created=await Property.create({...body,userId:user._id,status:"active"});return NextResponse.json({success:true,data:normalizePropertyListing(created.toObject())},{status:201})}
