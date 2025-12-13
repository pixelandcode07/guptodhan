import { Document, Types } from 'mongoose';

export interface ITestimonial extends Document {
  reviewID: string;
  customerImage: string;
  customerName: string;
  customerProfession: string;
  rating: number;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  date: Date;
  productID: Types.ObjectId;
}
