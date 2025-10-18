import { Document, Types } from 'mongoose';

export interface IBlog extends Document {
  blogId: string;
  coverImage: string;
  category: string;
  content: string; // <-- add here
  title: string;
  description: string;
  content: string;
  tags: string[];
  metaTitle: string;
  metaKeywords: string[];
  metaDescription: string;
  createdAt: Date;
  status: 'active' | 'inactive';
}
