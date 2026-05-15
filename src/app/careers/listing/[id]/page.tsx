import { notFound } from "next/navigation"
import { getServerSession } from "next-auth"
import { canViewCareerDetails } from "@/lib/careers/career-permissions"
import CareerDetail from "@/components/careers/career-detail"
import CareerMeta from "@/components/careers/career-meta"
import CareerSalary from "@/components/careers/career-salary"
import CareerCompany from "@/components/careers/career-company"

export default async function CareerListingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const base = process.env.NEXTAUTH_URL || "http://localhost:3000"
  const res = await fetch(`${base}/api/jobs/${id}`, { cache: "no-store" })
  if (res.status === 404) notFound()
  const data = await res.json()
  const item = data?.item
  if (!item) notFound()

  const session = await getServerSession()
  const canView = canViewCareerDetails(session?.user)
  if (!session?.user?.email || !canView) {
    return <main className="container mx-auto max-w-3xl px-4 py-12"><h1 className="text-2xl font-bold">This job requires a JOBSEEKER role to access full details.</h1><div className="mt-4 flex gap-3"><a className="underline" href="/account">Add JOBSEEKER Role</a><a className="underline" href="/signin">Sign In</a><a className="underline" href="/account">Go To Account Roles</a></div></main>
  }

  return <main className="container mx-auto max-w-4xl px-4 py-8 space-y-5"><CareerDetail item={item} /><CareerMeta item={item} /><CareerSalary item={item} /><section><h2 className="font-semibold">Responsibilities</h2><ul>{item.responsibilities?.map((x: string) => <li key={x}>{x}</li>)}</ul></section><section><h2 className="font-semibold">Qualifications</h2><ul>{item.qualifications?.map((x: string) => <li key={x}>{x}</li>)}</ul></section><section><h2 className="font-semibold">Benefits</h2><ul>{item.benefits?.map((x: string) => <li key={x}>{x}</li>)}</ul></section><CareerCompany item={item} /></main>
}
