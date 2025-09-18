import { Schema, model, models } from 'mongoose';
import { IBlog } from './blog.interface';

const blogSchema = new Schema<IBlog>(
  {
    blogId: { type: String, required: true, unique: true },
    coverImage: { type: String, required: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    tags: [{ type: String }],
    metaTitle: { type: String, required: true },
    metaKeywords: [{ type: String }],
    metaDescription: { type: String, required: true },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  },
  { timestamps: true }
);

export const BlogModel = models.BlogModel || model<IBlog>('BlogModel', blogSchema);
