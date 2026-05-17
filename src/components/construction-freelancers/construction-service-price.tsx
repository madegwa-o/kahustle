import { formatCurrency } from "@/lib/vehicles/vehicle-formatters"
export default function ConstructionServicePrice({ price, currency }: { price: number; currency: string }) { return <p className="text-2xl font-bold">{formatCurrency(price, currency)}</p> }
