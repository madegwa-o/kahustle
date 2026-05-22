import { Schema, model, models, Types, Document } from "mongoose"

export interface IConstructionService extends Document {
    _id: Types.ObjectId
    name: string
    description: string
    price: number
    userId: Types.ObjectId
    images: string[]
    status: "active" | "inactive"
    views: number
    createdAt: Date
    updatedAt: Date
    // Construction Service-specific fields
    subcategory?: string
    category: string
    expertise: string[]
    yearsOfExperience: number
    license?: string
    insurance: boolean
    availability: "immediately" | "within-2-weeks" | "within-month" | "flexible"
    serviceArea: string[]
    priceType: "fixed" | "hourly" | "negotiable"
    certifications: string[]
    previousProjects?: number
}

const ConstructionServiceSchema = new Schema<IConstructionService>(
    {
        name: {
            type: String,
            required: [true, "Service name is required"],
            trim: true,
            minlength: [3, "Name must be at least 3 characters"],
            maxlength: [100, "Name cannot exceed 100 characters"],
            index: true,
        },
        description: {
            type: String,
            trim: true,
            maxlength: [2000, "Description cannot exceed 2000 characters"],
            default: "",
        },
        price: {
            type: Number,
            required: [true, "Price is required"],
            min: [0, "Price cannot be negative"],
            index: true,
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User ID is required"],
            index: true,
        },
        images: {
            type: [String],
            default: [],
        },
        status: {
            type: String,
            enum: ["active", "inactive"],
            default: "active",
            index: true,
        },
        views: {
            type: Number,
            default: 0,
            min: 0,
        },
        // Construction Service-specific fields
        subcategory: {
            type: String,
            trim: true,
            lowercase: true,
            index: true,
        },
        category: {
            type: String,
            required: [true, "Category is required"],
            trim: true,
            index: true,
        },
        expertise: {
            type: [String],
            default: [],
        },
        yearsOfExperience: {
            type: Number,
            required: [true, "Years of experience is required"],
            min: [0, "Years of experience cannot be negative"],
        },
        license: {
            type: String,
            trim: true,
            sparse: true,
        },
        insurance: {
            type: Boolean,
            default: false,
        },
        availability: {
            type: String,
            enum: ["immediately", "within-2-weeks", "within-month", "flexible"],
            required: [true, "Availability is required"],
        },
        serviceArea: {
            type: [String],
            default: [],
        },
        priceType: {
            type: String,
            enum: ["fixed", "hourly", "negotiable"],
            required: [true, "Price type is required"],
        },
        certifications: {
            type: [String],
            default: [],
        },
        previousProjects: {
            type: Number,
            min: [0, "Previous projects cannot be negative"],
            sparse: true,
        },
    },
    {
        timestamps: true,
        versionKey: false,
        toJSON: {
            virtuals: true,
        },
        toObject: {
            virtuals: true,
        },
    }
)

// Compound indexes for common queries
ConstructionServiceSchema.index({ userId: 1, status: 1 })
ConstructionServiceSchema.index({ subcategory: 1, status: 1 })
ConstructionServiceSchema.index({ category: 1, status: 1 })
ConstructionServiceSchema.index({ serviceArea: 1, status: 1 })
ConstructionServiceSchema.index({ createdAt: -1 })

export const ConstructionService =
    models.ConstructionService ||
    model<IConstructionService>("ConstructionService", ConstructionServiceSchema)