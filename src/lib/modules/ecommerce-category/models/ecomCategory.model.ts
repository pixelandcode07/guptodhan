import { Schema, model, models } from 'mongoose';
import { ICategory } from '../interfaces/ecomCategory.interface';

const categorySchema = new Schema<ICategory>(
  {
    categoryId: { type: String, required: true, unique: true },
    name: { type: String, required: true, trim: true },
    categoryIcon: { type: String, required: true },
    categoryBanner: { type: String },
    isFeatured: { type: Boolean, default: false },
    isNavbar: { type: Boolean, default: false },
    slug: { type: String, required: true, unique: true },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const CategoryModel =
  models.CategoryModel || model<ICategory>('CategoryModel', categorySchema);
