import { Document, Types } from 'mongoose';

export interface IReview extends Document {
  reviewId: string;
  userId: Types.ObjectId;
  userName: string;
  userEmail: string;
  uploadedTime: Date;
  rating: number;
  comment: string; 
  userImage: string;
}
