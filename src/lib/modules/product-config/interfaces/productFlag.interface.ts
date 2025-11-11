import { Document } from 'mongoose';

export interface IProductFlag extends Document {
  productFlagId: string;
  name: string;
  icon?: string;
  status: 'active' | 'inactive';
  featured: boolean;
  createdAt: Date;
  orderCount: number;
}
