import { notFound } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { Types } from "mongoose"
import { getJob } from "@/lib/careers/get-job"
import { normalizeJobDetail } from "@/lib/careers/normalize-job"
import { canViewCareerDetails } from "@/lib/careers/career-permissions"
import CareerDetail from "@/components/careers/career-detail"
import CareerMeta from "@/components/careers/career-meta"
import CareerSalary from "@/components/careers/career-salary"
import CareerCompany from "@/components/careers/career-company"
import ImageSwiper from "@/components/ImageSwiper"

export default async function CareerListingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  if (!Types.ObjectId.isValid(id)) notFound()

  const session = await getServerSession(authOptions)
  const canView = canViewCareerDetails(session?.user)

  const job = await getJob(id)
  if (!job || Array.isArray(job) || job.status !== "active") notFound()

  const item = normalizeJobDetail(job, canView)

  if (!session?.user?.email || !canView) {
    return (
        <main className="container mx-auto max-w-3xl px-4 py-12">
          <h1 className="text-2xl font-bold">
            This job requires a JOBSEEKER role to access full details.
          </h1>
          <div className="mt-4 flex gap-3">
            <a className="underline" href="/account">Add JOBSEEKER Role</a>
            <a className="underline" href="/signin">Sign In</a>
          </div>
        </main>
    )
  }

  const images: string[] = item.images ?? []

  return (
      <main className="container mx-auto max-w-4xl px-4 py-8 space-y-5">

        {images.length > 0 && (
            <div className="rounded-lg overflow-hidden border">
              <ImageSwiper images={images} alt={item.jobTitle} height="h-72" />
            </div>
        )}

        <CareerDetail item={item} />
        <CareerMeta item={item} />
        <CareerSalary item={item} />

        {item.responsibilities?.length > 0 && (
            <section>
              <h2 className="font-semibold mb-2">Responsibilities</h2>
              <ul className="list-disc list-inside space-y-1 text-sm">
                {item.responsibilities.map((x: string) => <li key={x}>{x}</li>)}
              </ul>
            </section>
        )}

        {item.qualifications?.length > 0 && (
            <section>
              <h2 className="font-semibold mb-2">Qualifications</h2>
              <ul className="list-disc list-inside space-y-1 text-sm">
                {item.qualifications.map((x: string) => <li key={x}>{x}</li>)}
              </ul>
            </section>
        )}

        {item.benefits?.length > 0 && (
            <section>
              <h2 className="font-semibold mb-2">Benefits</h2>
              <ul className="list-disc list-inside space-y-1 text-sm">
                {item.benefits.map((x: string) => <li key={x}>{x}</li>)}
              </ul>
            </section>
        )}

        <CareerCompany item={item} />
      </main>
  )
}