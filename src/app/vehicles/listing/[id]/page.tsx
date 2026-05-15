import SpecializedProductDetailPage from "@/components/specialized-product-detail-page"
import { Vehicle } from "@/models/Vehicle"

const asText = (value: unknown) => (typeof value === "string" && value.trim().length > 0 ? value : "N/A")
const asNumber = (value: unknown) => (typeof value === "number" ? value : null)

export default async function VehicleListingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  return (
    <SpecializedProductDetailPage
      id={id}
      config={{
        category: "vehicles",
        listingLabel: "Vehicle",
        model: Vehicle,
        callbackPrefix: "/vehicles/listing",
        details: (item) => [
          { label: "Make", value: asText(item.make) },
          { label: "Model", value: asText(item.vehicleModel) },
          { label: "Year", value: asNumber(item.year)?.toString() ?? "N/A" },
          { label: "Mileage", value: asNumber(item.mileage) !== null ? `${asNumber(item.mileage)?.toLocaleString()} km` : "N/A" },
          { label: "Fuel", value: asText(item.fuelType) },
          { label: "Transmission", value: asText(item.transmission) },
        ],
      }}
    />
  )
}
