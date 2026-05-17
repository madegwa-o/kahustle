import type { Role } from "@/lib/roles"
import { Role as UserRole } from "@/lib/roles"

type UserLike = { id?: string | null; _id?: string | null; roles?: string[] } | null | undefined
type CareerLike = { userId?: string | null | { _id?: string | null } }

const hasRole = (user: UserLike, role: Role) => !!user?.roles?.includes(role)

export function canViewCareerDetails(user: UserLike) { return hasRole(user, UserRole.JOBSEEKER) }
export function canCreateCareer(user: UserLike) { return hasRole(user, UserRole.RECRUITER) }
export function canEditCareer(user: UserLike, career: CareerLike) {
  const uid = user?.id || user?._id
  const ownerId = typeof career?.userId === "string" ? career.userId : career?.userId?._id
  return !!uid && !!ownerId && uid === ownerId
}
export function canDeleteCareer(user: UserLike, career: CareerLike) { return canEditCareer(user, career) }
