import type { IJob } from "@/models/Job"

type PopUser = { name?: string; email?: string; phone?: string; image?: string }

type RawJob = Partial<IJob> & {
  _id: unknown
  jobTitle?: string
  company?: string
  images?: unknown // could be string, string[], null, undefined coming from DB
}

function normalizeImages(images: unknown): string[] {
  if (!images) return []
  if (Array.isArray(images)) return images.filter((i): i is string => typeof i === "string")
  if (typeof images === "string" && images.trim()) return [images]
  return []
}

export function normalizeJobCard(job: RawJob) {
  const id = String(job._id)
  const images = normalizeImages(job.images)

  return {
    id,
    name:           job.jobTitle || job.jobTitle || "Untitled",
    jobTitle:       job.jobTitle || job.jobTitle || "Untitled",
    company:        job.company || "Unknown",
    location:       job.location || "N/A",
    remote:         !!job.remote,
    employmentType: job.employmentType || "N/A",
    salaryMin:      Number(job.salaryMin  || 0),
    salaryMax:      Number(job.salaryMax  || 0),
    currency:       job.currency || "KES",
    images,                          // ✅ always a string[]
    image:          images[0] ?? null, // convenience: first image or null
    createdAt:      job.createdAt,
    detailUrl:      `/careers/listing/${id}`,
    status:         job.status || "inactive",
  }
}

export function normalizeJobDetail(job: any, canViewProtected: boolean) {
  const base = normalizeJobCard(job)

  return {
    ...base,
    description:     canViewProtected ? (job.description || "") : null,
    deadline:        canViewProtected ? (job.deadline ?? null) : null,
    responsibilities: canViewProtected ? (job.responsibilities || []) : [],
    qualifications:  canViewProtected ? (job.qualifications   || []) : [],
    benefits:        canViewProtected ? (job.benefits         || []) : [],
    recruiter: canViewProtected
        ? ({
          name:  job.userId?.name  || null,
          email: job.userId?.email || null,
          phone: job.userId?.phone || null,
          image: job.userId?.image || null,
        } satisfies PopUser)
        : null,
  }
}