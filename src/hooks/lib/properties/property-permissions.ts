import { Role } from "@/lib/roles"
type UserLike = { _id?: string; roles?: string[] } | null | undefined
const hasRole = (u: UserLike, r: Role) => !!u?.roles?.includes(r)
export const canViewPropertySellerContact = (u: UserLike) => hasRole(u, Role.PROPERTY_BUYER)
export const canCreateProperty = (u: UserLike) => hasRole(u, Role.PROPERTY_SELLER)
