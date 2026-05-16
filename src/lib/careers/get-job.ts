// lib/careers/get-job.ts  ← shared query logic
import {connectToDatabase} from "@/lib/db";
import {Job} from "@/models";

export async function getJob(id: string) {
    await connectToDatabase()
    const job = await Job.findByIdAndUpdate(id, { $inc: { views: 1 } }, { new: true })
        .populate("userId", "name email phone image")
        .lean()
    if (!job || Array.isArray(job) || job.status !== "active") return null
    return job
}