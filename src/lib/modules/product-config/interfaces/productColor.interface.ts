import { Document } from 'mongoose';

export interface IProductColor extends Document {
  productColorId: string;
  color: string;
  colorName: string;
  colorCode: string;
  status: 'active' | 'inactive';
  createdAt: Date;
}
