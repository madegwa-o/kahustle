import { FilterQuery } from "mongoose"
import type { IJob } from "@/models/Job"

const esc = (v: string) => v.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

export function parsePagination(sp: URLSearchParams) {
  const page = Math.max(1, Number(sp.get("page") || 1))
  const limit = Math.min(50, Math.max(1, Number(sp.get("limit") || 20)))
  return { page, limit, skip: (page - 1) * limit }
}

export function buildCareerFilter(sp: URLSearchParams): FilterQuery<IJob> {
  const q: FilterQuery<IJob> = { status: "active" }
  const employmentType = sp.get("employmentType")
  const location = sp.get("location")
  const industry = sp.get("industry")
  const company = sp.get("company")
  const remote = sp.get("remote")
  const search = sp.get("search")
  const salaryMin = sp.get("salaryMin")
  const salaryMax = sp.get("salaryMax")

  if (employmentType) q.employmentType = employmentType
  if (location) q.location = new RegExp(esc(location), "i")
  if (industry) q.industry = new RegExp(esc(industry), "i")
  if (company) q.company = new RegExp(esc(company), "i")
  if (remote === "true") q.remote = true
  if (remote === "false") q.remote = false
  if (search) q.$or = [{ jobTitle: new RegExp(esc(search), "i") }, { name: new RegExp(esc(search), "i") }, { company: new RegExp(esc(search), "i") }]
  if (salaryMin || salaryMax) {
    q.salaryMin = {}
    if (salaryMin) (q.salaryMin as Record<string, number>).$gte = Number(salaryMin)
    if (salaryMax) (q.salaryMin as Record<string, number>).$lte = Number(salaryMax)
  }
  return q
}

export function buildCareerSort(sp: URLSearchParams) {
  const sort = sp.get("sort") || "latest"
  if (sort === "salary_asc") return { salaryMin: 1 }
  if (sort === "salary_desc") return { salaryMax: -1 }
  if (sort === "views") return { views: -1 }
  return { createdAt: -1 }
}
