import { Role } from "@/lib/roles"
type UserLike = { _id?: string; roles?: string[] } | null | undefined
const hasRole = (u: UserLike, r: Role) => !!u?.roles?.includes(r)
export const canViewConstructionFreelancerContact = (u: UserLike) => hasRole(u, Role.CONSTRUCTION_FREELANCER_SEEKER)
export const canCreateConstructionService = (u: UserLike) => hasRole(u, Role.CONSTRUCTION_FREELANCER)
