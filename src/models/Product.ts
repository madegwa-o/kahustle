import { Schema, model, models, Types, Document } from "mongoose"

export interface IProduct extends Document {
    _id: Types.ObjectId
    name: string
    description: string
    price: number
    category: string
    userId: Types.ObjectId
    images: string[]
    status: "active" | "inactive"
    views: number
    createdAt: Date
    updatedAt: Date
}

const ProductSchema = new Schema<IProduct>(
    {
        name: {
            type: String,
            required: [true, "Product name is required"],
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
        category: {
            type: String,
            required: [true, "Category is required"],
            trim: true,
            lowercase: true,
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
ProductSchema.index({ userId: 1, status: 1 })
ProductSchema.index({ category: 1, status: 1 })
ProductSchema.index({ createdAt: -1 })

export const Product = models.Product || model<IProduct>("Product", ProductSchema)
