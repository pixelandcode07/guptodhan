import { Document } from 'mongoose';

export interface IClassifiedCategory {
  _id?: string; // Optional for new
  name: string;
  slug: string; // ✅ Added Slug
  icon?: string;
  status: 'active' | 'inactive';
  orderCount?: number;
  createdAt?: Date;
  updatedAt?: Date;
}


