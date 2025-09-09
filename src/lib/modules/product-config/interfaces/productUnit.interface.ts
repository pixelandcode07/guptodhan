import { Document } from 'mongoose';

export interface IProductUnit extends Document {
  productUnitId: string;
  name: string;
  status: 'active' | 'inactive';
  createdAt: Date;
}
