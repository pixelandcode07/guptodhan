import { Document } from 'mongoose';

export interface IStory extends Document {
  imageUrl: string;
  duration?: number;
  status: 'active' | 'inactive';
  expiryDate: Date;
  createdAt: Date;
  updatedAt: Date;
}
