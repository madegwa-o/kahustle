import SpecializedProductDetailPage from "@/components/specialized-product-detail-page"
import { ConstructionService } from "@/models/ConstructionService"

const asText = (value: unknown) => (typeof value === "string" && value.trim().length > 0 ? value : "N/A")
const asNumber = (value: unknown) => (typeof value === "number" ? value : null)

export default async function ConstructionListingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  return (
    <SpecializedProductDetailPage
      id={id}
      config={{
        category: "construction-freelancers",
        listingLabel: "Construction Freelancer",
        model: ConstructionService,
        callbackPrefix: "/construction-freelancers/listing",
        details: (item) => [
          { label: "Specialty", value: asText(item.category) },
          { label: "Experience", value: `${asNumber(item.yearsOfExperience) ?? 0} years` },
          { label: "Price Type", value: asText(item.priceType) },
          { label: "Availability", value: asText(item.availability) },
          { label: "Insured", value: item.insurance === true ? "Yes" : "No" },
          { label: "Service Areas", value: Array.isArray(item.serviceArea) ? item.serviceArea.filter((x): x is string => typeof x === "string").join(", ") || "N/A" : "N/A" },
        ],
      }}
    />
  )
}
