import { Document, Types } from 'mongoose';

export interface IBlog extends Document {
  // blogId: string;
  coverImage: string;
  category: string;
  title: string;
  description: string;
  tags: string[];
  metaTitle: string;
  metaKeywords: string[];
  metaDescription: string;
  createdAt: Date;
  status: 'active' | 'inactive';
}
