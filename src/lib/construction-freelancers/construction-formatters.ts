export function formatCurrency(amount: number, currency = "KES") {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatPostedDate(date?: Date | string) {
  if (!date) return ""
  return new Intl.DateTimeFormat("en-KE", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date))
}

export function formatConstructionValue(value?: string) {
  if (!value) return ""
  return value.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
}

export function formatExperience(years?: number) {
  if (years == null) return undefined
  return `${years} ${years === 1 ? "year" : "years"} experience`
}
