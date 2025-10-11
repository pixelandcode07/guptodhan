import { Document } from 'mongoose';

export interface IProductSimType extends Document {
  simTypeId: string;
  name: string;
  status: 'active' | 'inactive';
  createdAt: Date;
}
