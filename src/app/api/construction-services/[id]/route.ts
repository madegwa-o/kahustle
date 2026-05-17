import { NextResponse } from "next/server"
import { getConstructionService } from "@/lib/construction-freelancers/get-construction-service"
import { normalizeConstructionDetail } from "@/lib/construction-freelancers/normalize-construction"
import { canViewConstructionFreelancerContact } from "@/lib/construction-freelancers/construction-permissions"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
export async function GET(_:Request,{params}:{params:Promise<{id:string}>}){const [session,{id}]=await Promise.all([getServerSession(authOptions),params]);const service=await getConstructionService(id);if(!service)return NextResponse.json({success:false,error:"Not found"},{status:404});const user=session?.user?{_id:session.user.id??undefined,roles:session.user.roles}:null;const canViewContact=canViewConstructionFreelancerContact(user);return NextResponse.json({success:true,data:normalizeConstructionDetail(service,canViewContact)})}
