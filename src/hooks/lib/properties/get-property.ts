import { connectToDatabase } from "@/lib/db"
import { IProperty, Property } from "@/models/Property"
export async function getProperty(id:string){await connectToDatabase();const property=await Property.findByIdAndUpdate(id,{$inc:{views:1}},{new:true}).populate("userId","name email phone location").lean<IProperty>();if(!property||Array.isArray(property)||property.status!=="active") return null;return property}
