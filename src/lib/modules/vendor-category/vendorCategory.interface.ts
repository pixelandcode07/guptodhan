import { Document } from 'mongoose';

export interface IVendorCategory extends Document {
  name: string;
  slug: string;
  status: 'active' | 'inactive';
  createdAt: Date;
}
