
import { Document, Types } from 'mongoose';

export interface IClassifiedSubCategory extends Document {
  name: string;
  category: Types.ObjectId;
  icon?: string; 
  status: 'active' | 'inactive';
}