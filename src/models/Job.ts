import { Schema, model, models, Types, Document } from "mongoose"

export interface IJob extends Document {
    _id:            Types.ObjectId
    jobTitle:       string
    company:        string
    industry:       string
    employmentType: "full-time" | "part-time" | "contract" | "temporary"
    location:       string
    remote:         boolean
    salaryMin:      number
    salaryMax:      number
    currency:       string
    description:    string
    responsibilities: string[]
    qualifications:   string[]
    benefits:         string[]
    deadline?:      Date
    images:         string[]
    userId:         Types.ObjectId
    status:         "active" | "inactive"
    views:          number
    createdAt:      Date
    updatedAt:      Date
}

const JobSchema = new Schema<IJob>(
    {
        // ── Core ────────────────────────────────────────────────────────────────
        jobTitle: {
            type:      String,
            required:  [true, "Job title is required"],
            trim:      true,
            minlength: [3,   "Job title must be at least 3 characters"],
            maxlength: [100, "Job title cannot exceed 100 characters"],
            index:     true,
        },
        company: {
            type:     String,
            required: [true, "Company name is required"],
            trim:     true,
            index:    true,
        },
        industry: {
            type:     String,
            required: [true, "Industry is required"],
            trim:     true,
        },
        employmentType: {
            type:     String,
            enum:     ["full-time", "part-time", "contract", "temporary"],
            required: [true, "Employment type is required"],
            index:    true,
        },
        location: {
            type:     String,
            required: [true, "Location is required"],
            trim:     true,
            index:    true,
        },
        remote: {
            type:    Boolean,
            default: false,
        },

        // ── Compensation ─────────────────────────────────────────────────────────
        salaryMin: {
            type:     Number,
            required: [true, "Minimum salary is required"],
            min:      [0, "Salary cannot be negative"],
        },
        salaryMax: {
            type:     Number,
            required: [true, "Maximum salary is required"],
            min:      [0, "Salary cannot be negative"],
        },
        currency: {
            type:    String,
            default: "KES", // ✅ Kenya-first default
            trim:    true,
        },

        // ── Details ──────────────────────────────────────────────────────────────
        description: {
            type:      String,
            trim:      true,
            maxlength: [8000, "Description cannot exceed 8000 characters"],
            default:   "",
        },
        responsibilities: { type: [String], default: [] },
        qualifications:   { type: [String], default: [] },
        benefits:         { type: [String], default: [] },
        deadline:         { type: Date }, // sparse index defined below

        // ── Media ────────────────────────────────────────────────────────────────
        images: { type: [String], default: [] },

        // ── Meta ─────────────────────────────────────────────────────────────────
        userId: {
            type:     Schema.Types.ObjectId,
            ref:      "User",
            required: [true, "User ID is required"],
            index:    true,
        },
        status: {
            type:    String,
            enum:    ["active", "inactive"],
            default: "active",
            index:   true,
        },
        views: {
            type:    Number,
            default: 0,
            min:     0,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
)

// ── Indexes ───────────────────────────────────────────────────────────────────
JobSchema.index({ userId: 1,     status: 1 })
JobSchema.index({ company: 1,       status: 1 })
JobSchema.index({ jobTitle: 1,      status: 1 })
JobSchema.index({ employmentType: 1, status: 1 })
JobSchema.index({ createdAt: -1 })
JobSchema.index({ deadline: 1 }, { sparse: true }) // ✅ sparse on the index, not the field

export const Job = models.Job || model<IJob>("Job", JobSchema)