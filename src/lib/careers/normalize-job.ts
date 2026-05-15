import type { IJob } from "@/models/Job"

type PopUser = { name?: string; email?: string; phone?: string; image?: string }

export function normalizeJobCard(job: Partial<IJob> & { _id: unknown; jobTitle?: string; company?: string; images?: string[] }) {
  const id = String(job._id)
  return {
    id,
    name: job.name || job.jobTitle || "Untitled",
    jobTitle: job.jobTitle || job.name || "Untitled",
    company: job.company || "Unknown",
    location: job.location || "N/A",
    remote: !!job.remote,
    employmentType: job.employmentType || "N/A",
    salaryMin: Number(job.salaryMin || 0),
    salaryMax: Number(job.salaryMax || 0),
    currency: job.currency || "USD",
    image: job.images?.[0] || null,
    createdAt: job.createdAt,
    detailUrl: `/careers/listing/${id}`,
    status: job.status || "inactive",
  }
}

export function normalizeJobDetail(job: any, canViewProtected: boolean) {
  const base = normalizeJobCard(job)
  return {
    ...base,
    description: canViewProtected ? (job.description || "") : null,
    responsibilities: canViewProtected ? (job.responsibilities || []) : [],
    qualifications: canViewProtected ? (job.qualifications || []) : [],
    benefits: canViewProtected ? (job.benefits || []) : [],
    recruiter: canViewProtected ? {
      name: job.userId?.name || null,
      email: job.userId?.email || null,
      phone: job.userId?.phone || null,
      image: job.userId?.image || null,
    } as PopUser : null,
  }
}
