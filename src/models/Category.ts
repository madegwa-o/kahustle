// models/Category.ts
import { Schema, model, models, Types, Document } from "mongoose";

export enum MainCategory {
	VEHICLES = "vehicles",
	CONSTRUCTION_FREELANCERS = "construction-freelancers",
	CAREERS = "careers",
	PROPERTIES = "properties",
}

export interface ISubcategory {
	label: string
	slug: string
}

export interface ICategory extends Document {
	_id: Types.ObjectId;
	mainCategory: MainCategory;
	subcategories: ISubcategory[];
	createdAt: Date;
	updatedAt: Date;
}

const SubcategorySchema = new Schema<ISubcategory>(
	{
		label: { type: String, required: true },
		slug:  { type: String, required: true },
	},
	{ _id: false } // no need for individual IDs on subcategories
)

const CategorySchema = new Schema<ICategory>(
	{
		mainCategory: {
			type: String,
			enum: Object.values(MainCategory),
			required: true,
			unique: true,
			index: true,
		},
		subcategories: {
			type: [SubcategorySchema],
			default: [],
			validate: {
				validator: (v: ISubcategory[]) => v.length > 0,
				message: "Subcategories array cannot be empty",
			},
		},
	},
	{ timestamps: true, versionKey: false }
)

export const Category = models.Category || model<ICategory>("Category", CategorySchema)