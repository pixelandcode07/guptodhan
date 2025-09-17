import { Document, Types } from 'mongoose';

export interface IChildCategory extends Document {
  childCategoryId: string;
  category: Types.ObjectId;
  subCategory: Types.ObjectId;
  name: string;
  icon: string;
  slug: string;
  status: 'active' | 'inactive';
  createdAt: Date;
}