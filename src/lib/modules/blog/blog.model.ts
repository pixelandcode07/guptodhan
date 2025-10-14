import { Schema, model, models } from 'mongoose';
import { IBlog } from './blog.interface';
import { v4 as uuidv4 } from 'uuid';

const blogSchema = new Schema<IBlog>(
  {
    blogId: { type: String, unique: true, default: uuidv4 },
    coverImage: { type: String, required: true },
    category: { type: String, required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    content: { type: String, required: true },
    tags: [{ type: String }],
    metaTitle: { type: String, required: true },
    metaKeywords: [{ type: String }],
    metaDescription: { type: String, required: true },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  },
  { timestamps: true }
);

export const BlogModel =
  models.BlogModel || model<IBlog>('BlogModel', blogSchema);
