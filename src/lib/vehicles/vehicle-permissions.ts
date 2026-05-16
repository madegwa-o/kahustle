import { Role } from "@/lib/roles"

type UserLike = { _id?: string; roles?: string[] } | null | undefined

const hasRole = (user: UserLike, role: Role) => !!user?.roles?.includes(role)

export function canViewVehicleSellerContact(user: UserLike) {
  return hasRole(user, Role.CARBUYER)
}

export function canCreateVehicle(user: UserLike) {
  return hasRole(user, Role.CARDEALER)
}

export function canEditVehicle(user: UserLike, sellerId?: string) {
  if (!user) return false
  return hasRole(user, Role.ADMIN) || hasRole(user, Role.STAFF) || (!!sellerId && user._id === sellerId)
}

export function canDeleteVehicle(user: UserLike, sellerId?: string) {
  return canEditVehicle(user, sellerId)
}
