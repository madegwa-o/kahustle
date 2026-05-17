import { NextResponse } from "next/server"
import { getProperty } from "@/lib/properties/get-property"
import { normalizePropertyDetail } from "@/lib/properties/normalize-property"
import { canViewPropertySellerContact } from "@/lib/properties/property-permissions"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
export async function GET(_:Request,{params}:{params:Promise<{id:string}>}){const [session,{id}]=await Promise.all([getServerSession(authOptions),params]);const property=await getProperty(id);if(!property)return NextResponse.json({success:false,error:"Not found"},{status:404});const user=session?.user?{_id:session.user.id??undefined,roles:session.user.roles}:null;const canViewContact=canViewPropertySellerContact(user);return NextResponse.json({success:true,data:normalizePropertyDetail(property,canViewContact)})}
