import { Schema, model, models } from 'mongoose';
import { ISubCategory } from '../interfaces/ecomSubCategory.interface';
import './ecomCategory.model'; // Import to ensure CategoryModel is registered

const subCategorySchema = new Schema<ISubCategory>(
  {
    subCategoryId: { type: String, required: true, unique: true },
    category: { type: Schema.Types.ObjectId, ref: 'CategoryModel', required: true },
    name: { type: String, required: true, trim: true },
    subCategoryIcon: { type: String },
    subCategoryBanner: { type: String },
    isFeatured: { type: Boolean, default: false },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    slug: { type: String, required: true, unique: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const SubCategoryModel =
  models.SubCategoryModel || model<ISubCategory>('SubCategoryModel', subCategorySchema, 'ecomsubcategorymodels');
