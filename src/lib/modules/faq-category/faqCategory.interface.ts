import { Document } from 'mongoose';

export interface IFAQCategory extends Document {
  name: string;
  isActive: boolean;
}
