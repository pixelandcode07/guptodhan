import { Document } from 'mongoose';

export interface IBlogCategory extends Document {
  name: string;
  slug: string;
  isFeatured: boolean;
  status: 'active' | 'inactive';
  createdAt: Date;
}
