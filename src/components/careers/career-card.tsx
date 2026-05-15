import Link from "next/link"
export default function CareerCard({ item, locked }: { item: any; locked?: boolean }) {
  return <Link href={item.detailUrl} className="block border rounded p-3"><h3 className="font-semibold">{item.jobTitle}</h3><p>{item.company} • {item.location}</p><p>{item.employmentType} • {item.currency} {item.salaryMin} - {item.salaryMax}</p>{item.remote ? <p>Remote</p> : null}{locked ? <p className="text-xs">Requires JOBSEEKER role</p> : null}</Link>
}
