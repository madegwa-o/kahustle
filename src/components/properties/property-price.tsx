import { formatCurrency } from "@/lib/properties/property-formatters"

export default function PropertyPrice({ price, currency }: { price: number; currency: string }) {
  return <p className="text-2xl font-bold">{formatCurrency(price, currency)}</p>
}
