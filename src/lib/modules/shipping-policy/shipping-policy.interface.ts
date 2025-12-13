import { Document } from 'mongoose';

export interface IShippingPolicy extends Document {
  content: string; // The HTML content from the rich text editor
  status: 'active' | 'inactive';
}