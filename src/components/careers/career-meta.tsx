export default function CareerMeta({ item }: { item: any }) { return <div className="text-sm">{item.employmentType} • {item.remote ? "Remote" : "On-site"}</div> }
