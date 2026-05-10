import { Schema, model, models, Types, Document } from "mongoose";

export enum PlanType {
	SILVER = "SILVER",
	GOLD = "GOLD",
}

export enum PlanCategory {
	VEHICLES = "VEHICLES",
	CONSTRUCTION_FREELANCERS = "CONSTRUCTION_FREELANCERS",
	CAREERS = "CAREERS",
	PROPERTIES = "PROPERTIES",
}

export interface IMembershipPlan extends Document {
	_id: Types.ObjectId;
	userId: Types.ObjectId;
	planType: PlanType;
	category: PlanCategory;
	startDate: Date;
	endDate: Date;
	status: "active" | "inactive" | "cancelled" | "expired";
	price: number;
	discountApplied?: boolean;
	createdAt: Date;
	updatedAt: Date;
}

const MembershipPlanSchema = new Schema<IMembershipPlan>(
	{
		userId: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: [true, "User ID is required"],
			index: true,
		},
		planType: {
			type: String,
			enum: Object.values(PlanType),
			required: [true, "Plan type is required"],
		},
		category: {
			type: String,
			enum: Object.values(PlanCategory),
			required: [true, "Category is required"],
			index: true,
		},
		startDate: {
			type: Date,
			required: [true, "Start date is required"],
			default: () => new Date(),
		},
		endDate: {
			type: Date,
			required: [true, "End date is required"],
		},
		status: {
			type: String,
			enum: ["active", "inactive", "cancelled", "expired"],
			default: "active",
			index: true,
		},
		price: {
			type: Number,
			required: [true, "Price is required"],
			min: [0, "Price cannot be negative"],
		},
		discountApplied: {
			type: Boolean,
			default: false,
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
);

// Compound indexes for common queries
MembershipPlanSchema.index({ userId: 1, status: 1 });
MembershipPlanSchema.index({ category: 1, status: 1 });
MembershipPlanSchema.index({ endDate: 1, status: 1 });

export const MembershipPlan = models.MembershipPlan || model<IMembershipPlan>("MembershipPlan", MembershipPlanSchema);
