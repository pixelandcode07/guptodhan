
import { Document } from 'mongoose';

export interface IBrand extends Document {
  name: string;
  logo?: string; // URL from Cloudinary
  status: 'active' | 'inactive';
}