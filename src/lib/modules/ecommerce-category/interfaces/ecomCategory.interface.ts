import { Document } from 'mongoose';

export interface ICategory extends Document {
  categoryId: string;
  name: string;
  categoryIcon: string;
  categoryBanner?: string;
  isFeatured: boolean;
  isNavbar: boolean;
  slug: string;
  status: 'active' | 'inactive';
  createdAt: Date;
  orderCount: number;
}
