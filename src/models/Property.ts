import { Schema, model, models, Types, Document } from "mongoose"

export interface IProperty extends Document {
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
    // Property-specific fields
    subcategory?: string
    propertyType: "residential" | "commercial" | "land"
    bedrooms: number
    bathrooms: number
    squareFeet: number
    address: string
    city: string
    state: string
    postalCode: string
    amenities: string[]
    yearBuilt?: number
    parking: "none" | "street" | "garage" | "lot"
    condition: "excellent" | "good" | "fair" | "needs-repair"
}

const PropertySchema = new Schema<IProperty>(
    {
        name: {
            type: String,
            required: [true, "Property name is required"],
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
        // Property-specific fields
        subcategory: {
            type: String,
            trim: true,
            lowercase: true,
            index: true,
        },
        propertyType: {
            type: String,
            enum: ["residential", "commercial", "land"],
            required: [true, "Property type is required"],
            index: true,
        },
        bedrooms: {
            type: Number,
            required: [true, "Number of bedrooms is required"],
            min: [0, "Bedrooms cannot be negative"],
        },
        bathrooms: {
            type: Number,
            required: [true, "Number of bathrooms is required"],
            min: [0, "Bathrooms cannot be negative"],
        },
        squareFeet: {
            type: Number,
            required: [true, "Square feet is required"],
            min: [0, "Square feet cannot be negative"],
        },
        address: {
            type: String,
            required: [true, "Address is required"],
            trim: true,
        },
        city: {
            type: String,
            required: [true, "City is required"],
            trim: true,
            index: true,
        },
        state: {
            type: String,
            required: [true, "State is required"],
            trim: true,
        },
        postalCode: {
            type: String,
            required: [true, "Postal code is required"],
            trim: true,
            index: true,
        },
        amenities: {
            type: [String],
            default: [],
        },
        yearBuilt: {
            type: Number,
            min: [1800, "Year must be valid"],
            max: [new Date().getFullYear(), "Year cannot be in the future"],
            sparse: true,
        },
        parking: {
            type: String,
            enum: ["none", "street", "garage", "lot"],
            default: "street",
        },
        condition: {
            type: String,
            enum: ["excellent", "good", "fair", "needs-repair"],
            required: [true, "Condition is required"],
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
PropertySchema.index({ userId: 1, status: 1 })
PropertySchema.index({ city: 1, status: 1 })
PropertySchema.index({ subcategory: 1, status: 1 })
PropertySchema.index({ propertyType: 1, status: 1 })
PropertySchema.index({ price: 1, status: 1 })
PropertySchema.index({ createdAt: -1 })

export const Property = models.Property || model<IProperty>("Property", PropertySchema)