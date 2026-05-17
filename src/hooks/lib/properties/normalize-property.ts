import { IProperty } from "@/models/Property"
import { Types } from "mongoose"

type SellerShape = { _id?: { toString(): string }; name?: string; email?: string; phone?: string; location?: string }

export type AnyProperty = Partial<IProperty> & {
  _id: Types.ObjectId | { toString(): string } | string
  userId?: SellerShape
}

export function normalizePropertyListing(property: AnyProperty) {
  const id = typeof property._id === "string" ? property._id : property._id.toString()
  return {
    id,
    name: property.name,
    price: property.price,
    currency: "KES",
    image: property.images?.[0] || null,
    subcategory: property.subcategory,
    city: property.city,
    propertyType: property.propertyType,
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    condition: property.condition,
    createdAt: property.createdAt,
    detailUrl: `/properties/listing/${id}`,
    status: property.status,
  }
}

export function normalizePropertyDetail(property: AnyProperty, canViewSellerContact: boolean, related: AnyProperty[] = []) {
  const listing = normalizePropertyListing(property)
  const seller = property.userId && typeof property.userId === "object" ? {
    id: property.userId._id?.toString?.() || "",
    name: property.userId.name,
    location: property.userId.location || "",
    ...(canViewSellerContact ? { email: property.userId.email, phone: property.userId.phone } : {}),
  } : null

  return {
    ...listing,
    description: property.description || "",
    views: property.views || 0,
    images: property.images || [],
    squareFeet: property.squareFeet,
    address: property.address,
    state: property.state,
    postalCode: property.postalCode,
    amenities: property.amenities || [],
    yearBuilt: property.yearBuilt,
    parking: property.parking,
    seller,
    relatedProperties: related.map(normalizePropertyListing),
  }
}

export type PropertyListing = ReturnType<typeof normalizePropertyListing>
export type PropertyDetail = ReturnType<typeof normalizePropertyDetail>
