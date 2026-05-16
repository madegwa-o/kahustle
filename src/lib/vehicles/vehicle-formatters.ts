export function formatVehicleTitle(make?: string, vehicleModel?: string, year?: number) {
  return [year, make, vehicleModel].filter(Boolean).join(" ")
}

export function formatCurrency(value: number, currency = "KES") {
  return new Intl.NumberFormat("en-KE", { style: "currency", currency, maximumFractionDigits: 0 }).format(value)
}

export function formatMileage(mileage?: number) {
  if (typeof mileage !== "number") return "N/A"
  return `${new Intl.NumberFormat("en-KE").format(mileage)} km`
}

export function formatPostedDate(date: Date | string) {
  const d = new Date(date)
  return new Intl.RelativeTimeFormat("en", { numeric: "auto" }).format(
    -Math.round((Date.now() - d.getTime()) / (1000 * 60 * 60 * 24)),
    "day"
  )
}

export function formatCondition(condition?: string) {
  if (!condition) return "Unknown"
  return condition.charAt(0).toUpperCase() + condition.slice(1)
}
