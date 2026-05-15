import SpecializedProductDetailPage from "@/components/specialized-product-detail-page"
import { MainCategory } from "@/lib/categories"
import { Job } from "@/models/Job"

const asText = (value: unknown) => (typeof value === "string" && value.trim().length > 0 ? value : "N/A")
const asNumber = (value: unknown) => (typeof value === "number" ? value : 0)

export default async function CareerListingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  return (
    <SpecializedProductDetailPage
      id={id}
      config={{
        category: "careers",
        listingLabel: "Career",
        model: Job,
        callbackPrefix: "/careers/listing",
        categoryKey: MainCategory.CAREERS,
        requiredViewRoleLabel: "JOBSEEKER",
        details: (item) => [
          { label: "Company", value: asText(item.company) },
          { label: "Job Title", value: asText(item.jobTitle) },
          { label: "Employment", value: asText(item.employmentType) },
          { label: "Location", value: asText(item.location) },
          { label: "Remote", value: item.remote === true ? "Yes" : "No" },
          {
            label: "Salary",
            value: `${asText(item.currency) === "N/A" ? "KES" : asText(item.currency)} ${asNumber(item.salaryMin).toLocaleString()} - ${asNumber(item.salaryMax).toLocaleString()}`,
          },
        ],
      }}
    />
  )
}
