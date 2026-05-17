import { connectToDatabase } from "@/lib/db"
import { ConstructionService, IConstructionService } from "@/models/ConstructionService"
export async function getConstructionService(id:string){await connectToDatabase();const service=await ConstructionService.findByIdAndUpdate(id,{$inc:{views:1}},{new:true}).populate("userId","name email phone location").lean<IConstructionService>();if(!service||Array.isArray(service)||service.status!=="active") return null;return service}
