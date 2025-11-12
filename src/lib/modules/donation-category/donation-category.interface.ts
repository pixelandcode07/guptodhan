import { Document } from 'mongoose';

export interface IDonationCategory extends Document {
  name: string;
  icon?: string; // Cloudinary URL
  status: 'active' | 'inactive';
  orderCount: number;
}