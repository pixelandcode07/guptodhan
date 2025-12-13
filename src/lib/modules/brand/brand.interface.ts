
import { Document } from 'mongoose';

export interface IBrand extends Document {
  name: string;
  logo?: string; 
  status: 'active' | 'inactive';
}