import { Document } from 'mongoose';

export interface IClassifiedCategory extends Document {
  name: string;
  icon?: string;
  status: 'active' | 'inactive';
}