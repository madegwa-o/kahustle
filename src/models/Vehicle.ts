import { Schema, model, models, Types, Document } from "mongoose"

export interface IVehicle extends Document {
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
    // Vehicle-specific fields
    subcategory?: string
    make: string
    vehicleModel: string
    year: number
    mileage: number
    fuelType: "petrol" | "diesel" | "hybrid" | "electric"
    transmission: "manual" | "automatic"
    bodyType: string
    color: string
    condition: "new" | "used"
    vin?: string
}

const VehicleSchema = new Schema<IVehicle>(
    {
        name: {
            type: String,
            required: [true, "Vehicle name is required"],
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
        // Vehicle-specific fields
        subcategory: {
            type: String,
            trim: true,
            lowercase: true,
            index: true,
        },
        make: {
            type: String,
            required: [true, "Vehicle make is required"],
            trim: true,
            index: true,
        },
        vehicleModel: {
            type: String,
            required: [true, "Vehicle model is required"],
            trim: true,
            maxlength: [50, "Model cannot exceed 50 characters"],
            index: true,
        },
        year: {
            type: Number,
            required: [true, "Vehicle year is required"],
            min: [1900, "Year must be valid"],
            max: [new Date().getFullYear() + 1, "Year cannot be in the future"],
        },
        mileage: {
            type: Number,
            required: [true, "Mileage is required"],
            min: [0, "Mileage cannot be negative"],
        },
        fuelType: {
            type: String,
            enum: ["petrol", "diesel", "hybrid", "electric"],
            required: [true, "Fuel type is required"],
        },
        transmission: {
            type: String,
            enum: ["manual", "automatic"],
            required: [true, "Transmission type is required"],
        },
        bodyType: {
            type: String,
            required: [true, "Body type is required"],
            trim: true,
        },
        color: {
            type: String,
            required: [true, "Color is required"],
            trim: true,
        },
        condition: {
            type: String,
            enum: ["new", "used"],
            required: [true, "Condition is required"],
        },
        vin: {
            type: String,
            trim: true,
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
VehicleSchema.index({ userId: 1, status: 1 })
VehicleSchema.index({ subcategory: 1, status: 1 })
VehicleSchema.index({ make: 1, status: 1 })
VehicleSchema.index({ year: -1, status: 1 })
VehicleSchema.index({ createdAt: -1 })

export const Vehicle = models.Vehicle || model<IVehicle>("Vehicle", VehicleSchema)
