import { Document } from 'mongoose';

export interface IProductWarranty extends Document {
  warrantyName: string;
  createdAt: Date;
  status: 'active' | 'inactive';
}
