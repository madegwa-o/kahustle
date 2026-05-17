import type { Role } from "@/lib/roles"
import { MainCategory, CATEGORY_REGISTRY } from "@/lib/categories"

type UserLike = { id?: string | null; _id?: string | null; roles?: string[] } | null | undefined
type ListingLike = { userId?: string | null | { _id?: string | null } }

export function hasRole(user: UserLike, role: Role): boolean {
  return !!user?.roles?.includes(role)
}

export function hasAnyRole(user: UserLike, roles: Role[]): boolean {
  return roles.some((role) => hasRole(user, role))
}

export function canCreateListing(user: UserLike, categoryKey: MainCategory): boolean {
  return hasAnyRole(user, CATEGORY_REGISTRY[categoryKey].createRoles)
}

export function canViewListingDetails(user: UserLike, categoryKey: MainCategory): boolean {
  return hasAnyRole(user, CATEGORY_REGISTRY[categoryKey].viewRoles)
}

export function canEditListing(user: UserLike, listing: ListingLike): boolean {
  const uid = user?.id || user?._id
  const ownerId = typeof listing?.userId === "string" ? listing.userId : listing?.userId?._id
  return !!uid && !!ownerId && uid === ownerId
}

export function canDeleteListing(user: UserLike, listing: ListingLike): boolean {
  return canEditListing(user, listing)
}
