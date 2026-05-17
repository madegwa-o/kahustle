import { IConstructionService } from "@/models/ConstructionService"
import { Types } from "mongoose"

type FreelancerShape = { _id?: { toString(): string }; name?: string; email?: string; phone?: string; location?: string }

export type AnyConstructionService = Partial<IConstructionService> & {
  _id: Types.ObjectId | { toString(): string } | string
  userId?: FreelancerShape
}

export function normalizeConstructionListing(service: AnyConstructionService) {
  const id = typeof service._id === "string" ? service._id : service._id.toString()
  return {
    id,
    name: service.name,
    price: service.price,
    currency: "KES",
    image: service.images?.[0] || null,
    subcategory: service.subcategory,
    category: service.category,
    availability: service.availability,
    serviceArea: service.serviceArea || [],
    yearsOfExperience: service.yearsOfExperience,
    createdAt: service.createdAt,
    detailUrl: `/construction-freelancers/listing/${id}`,
    status: service.status,
  }
}

export function normalizeConstructionDetail(service: AnyConstructionService, canViewFreelancerContact: boolean, related: AnyConstructionService[] = []) {
  const listing = normalizeConstructionListing(service)
  const freelancer = service.userId && typeof service.userId === "object" ? {
    id: service.userId._id?.toString?.() || "",
    name: service.userId.name,
    location: service.userId.location || "",
    ...(canViewFreelancerContact ? { email: service.userId.email, phone: service.userId.phone } : {}),
  } : null

  return {
    ...listing,
    description: service.description || "",
    views: service.views || 0,
    images: service.images || [],
    skills: service.expertise || [],
    license: service.license,
    insurance: service.insurance,
    priceType: service.priceType,
    certifications: service.certifications || [],
    previousProjects: service.previousProjects,
    freelancer,
    relatedFreelancers: related.map(normalizeConstructionListing),
  }
}

export type ConstructionListing = ReturnType<typeof normalizeConstructionListing>
export type ConstructionDetail = ReturnType<typeof normalizeConstructionDetail>
