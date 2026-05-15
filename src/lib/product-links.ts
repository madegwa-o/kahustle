const CATEGORY_ROUTE_PREFIX: Record<string, string> = {
  vehicles: "/vehicles/listing",
  properties: "/properties/listing",
  careers: "/careers/listing",
  "construction-freelancers": "/construction-freelancers/listing",
}

export function getProductDetailLink(category: string | undefined, id: string): string {
  if (!category) {
    return `/product/${id}`
  }

  const normalizedCategory = category.trim().toLowerCase()
  const categoryPath = CATEGORY_ROUTE_PREFIX[normalizedCategory]

  if (!categoryPath) {
    return `/product/${id}`
  }

  return `${categoryPath}/${id}`
}
