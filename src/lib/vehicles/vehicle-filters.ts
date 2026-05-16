export const vehicleSortOptions = [
  "newest",
  "oldest",
  "lowest-price",
  "highest-price",
  "lowest-mileage",
  "highest-mileage",
  "newest-year",
] as const

export type VehicleSort = typeof vehicleSortOptions[number]

export const vehicleFilterFields = [
  "make",
  "vehicleModel",
  "year",
  "condition",
  "fuelType",
  "transmission",
  "bodyType",
  "minMileage",
  "maxMileage",
  "minPrice",
  "maxPrice",
  "location",
  "search",
] as const
