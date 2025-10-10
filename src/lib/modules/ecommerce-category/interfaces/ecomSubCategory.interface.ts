import { Document, Types } from 'mongoose';

export interface ISubCategory extends Document {
  subCategoryId: string;
  category: Types.ObjectId;
  name: string;
  subCategoryIcon?: string;
  subCategoryBanner?: string;
  isFeatured: boolean;
  isNavbar?: boolean;
  status: 'active' | 'inactive';
  slug: string;
  createdAt: Date;
}
