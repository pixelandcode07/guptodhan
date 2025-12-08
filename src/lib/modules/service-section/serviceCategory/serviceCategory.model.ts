import { Schema, model, models } from "mongoose";
import { IServiceCategory } from "./serviceCategory.interface";

const serviceCategorySchema = new Schema<IServiceCategory>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    slug: { type: String, required: true, unique: true, trim: true },
    icon_url: { type: String, required: true },
  },
  { timestamps: true }
);

export const ServiceCategoryModel =
  models.ServiceCategoryModel ||
  model<IServiceCategory>("ServiceCategoryModel", serviceCategorySchema);
