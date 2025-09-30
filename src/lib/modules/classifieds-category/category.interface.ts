import { Document } from 'mongoose';

export interface IClassifiedCategory extends Document {
  name: string;
  slug: string;
  icon?: string;
  status: 'active' | 'inactive';
}


