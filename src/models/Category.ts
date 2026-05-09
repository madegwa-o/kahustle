import { Schema, model, models, Types, Document } from "mongoose";

export enum MainCategory {
	VEHICLES = "VEHICLES",
	CONSTRUCTION_FREELANCERS = "CONSTRUCTION_FREELANCERS",
	CAREERS = "CAREERS",
	PROPERTIES = "PROPERTIES",
}

export interface ICategory extends Document {
	_id: Types.ObjectId;
	mainCategory: MainCategory;
	subcategories: string[];
	createdAt: Date;
	updatedAt: Date;
}

const CategorySchema = new Schema<ICategory>(
	{
		mainCategory: {
			type: String,
			enum: Object.values(MainCategory),
			required: [true, "Main category is required"],
			unique: true,
			index: true,
		},
		subcategories: {
			type: [String],
			default: [],
			required: [true, "At least one subcategory is required"],
			validate: {
				validator: function(v: string[]) {
					return v.length > 0;
				},
				message: "Subcategories array cannot be empty",
			},
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

export const Category = models.Category || model<ICategory>("Category", CategorySchema);
