import { Document, Types } from 'mongoose';

export interface ISubCategory extends Document {
  subCategoryId: string;
  category: Types.ObjectId;
  name: string;
  icon: string;
  image?: string;
  isFeatured: boolean;
  status: 'active' | 'inactive';
  slug: string;
  createdAt: Date;
}
