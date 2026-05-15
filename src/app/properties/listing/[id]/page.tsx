import SpecializedProductDetailPage from "@/components/specialized-product-detail-page"
import { MainCategory } from "@/lib/categories"
import { Property } from "@/models/Property"

const asText = (value: unknown) => (typeof value === "string" && value.trim().length > 0 ? value : "N/A")
const asNumber = (value: unknown) => (typeof value === "number" ? value : null)

export default async function PropertyListingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  return (
    <SpecializedProductDetailPage
      id={id}
      config={{
        category: "properties",
        listingLabel: "Property",
        model: Property,
        callbackPrefix: "/properties/listing",
        categoryKey: MainCategory.PROPERTIES,
        requiredViewRoleLabel: "PROPERTY_BUYER",
        details: (item) => [
          { label: "Type", value: asText(item.propertyType) },
          { label: "Bedrooms", value: asNumber(item.bedrooms)?.toString() ?? "N/A" },
          { label: "Bathrooms", value: asNumber(item.bathrooms)?.toString() ?? "N/A" },
          { label: "Square Feet", value: asNumber(item.squareFeet)?.toLocaleString() ?? "N/A" },
          { label: "City", value: asText(item.city) },
          { label: "Condition", value: asText(item.condition) },
        ],
      }}
    />
  )
}
