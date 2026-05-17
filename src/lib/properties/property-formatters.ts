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

export function formatPropertyCondition(condition?: string) {
  if (!condition) return ""
  return condition.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
}

export function formatSquareFeet(squareFeet?: number) {
  if (squareFeet == null) return undefined
  return `${squareFeet.toLocaleString()} sq ft`
}
