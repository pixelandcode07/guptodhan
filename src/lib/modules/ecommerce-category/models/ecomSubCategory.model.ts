import { Schema, model, models } from 'mongoose';
import { ISubCategory } from '../interfaces/ecomSubCategory.interface';

const subCategorySchema = new Schema<ISubCategory>(
  {
    subCategoryId: { type: String, required: true, unique: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    name: { type: String, required: true, trim: true },
    icon: { type: String, required: true },
    image: { type: String },
    isFeatured: { type: Boolean, default: false },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    slug: { type: String, required: true, unique: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const SubCategoryModel =
  models.SubCategoryModel || model<ISubCategory>('SubCategoryModel', subCategorySchema);
