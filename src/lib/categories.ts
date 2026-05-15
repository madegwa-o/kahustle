import { Role } from "@/lib/roles"

export enum MainCategory {
  VEHICLES = "VEHICLES",
  CONSTRUCTION_FREELANCERS = "CONSTRUCTION_FREELANCERS",
  CAREERS = "CAREERS",
  PROPERTIES = "PROPERTIES",
}

export interface CategoryPermissionConfig {
  key: MainCategory
  displayName: string
  createRoles: Role[]
  viewRoles: Role[]
  createRoute: string
  detailRoute: string
}

export const CATEGORY_REGISTRY: Record<MainCategory, CategoryPermissionConfig> = {
  [MainCategory.CAREERS]: {
    key: MainCategory.CAREERS,
    displayName: "Careers",
    createRoles: [Role.RECRUITER],
    viewRoles: [Role.JOBSEEKER],
    createRoute: "/api/jobs",
    detailRoute: "/careers/listing",
  },
  [MainCategory.VEHICLES]: {
    key: MainCategory.VEHICLES,
    displayName: "Vehicles",
    createRoles: [Role.CARDEALER],
    viewRoles: [Role.CARBUYER],
    createRoute: "/api/vehicles",
    detailRoute: "/vehicles/listing",
  },
  [MainCategory.PROPERTIES]: {
    key: MainCategory.PROPERTIES,
    displayName: "Properties",
    createRoles: [Role.PROPERTY_SELLER],
    viewRoles: [Role.PROPERTY_BUYER],
    createRoute: "/api/properties",
    detailRoute: "/properties/listing",
  },
  [MainCategory.CONSTRUCTION_FREELANCERS]: {
    key: MainCategory.CONSTRUCTION_FREELANCERS,
    displayName: "Construction Freelancers",
    createRoles: [Role.CONSTRUCTION_FREELANCER],
    viewRoles: [Role.CONSTRUCTION_FREELANCER_SEEKER],
    createRoute: "/api/construction-services",
    detailRoute: "/construction-freelancers/listing",
  },
}
