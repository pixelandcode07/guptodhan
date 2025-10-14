import { Schema, model, models } from 'mongoose';
import { IBlogCategory } from './blogCategory.interface';

const blogCategorySchema = new Schema<IBlogCategory>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    isFeatured: { type: Boolean, default: false },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const BlogCategoryModel =
  models.BlogCategoryModel || model<IBlogCategory>('BlogCategoryModel', blogCategorySchema);
