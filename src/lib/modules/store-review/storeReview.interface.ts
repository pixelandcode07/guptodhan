import { Types } from 'mongoose';

export interface IStoreReview {
  storeId: Types.ObjectId | string;
  userId: string;
  userName: string;
  userImage?: string; 
  rating: number;
  comment: string;
  createdAt?: Date;
  updatedAt?: Date;
}