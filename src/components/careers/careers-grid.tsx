import CareerCard from "@/components/careers/career-card"
export default function CareersGrid({ items }: { items: any[] }) { return <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{items.map((i) => <CareerCard key={i.id} item={i} />)}</div> }
