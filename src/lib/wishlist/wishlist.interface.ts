import { Document, Types } from 'mongoose';

export interface IWishlist extends Document {
  userName: string;
  userEmail: string;
  userID: Types.ObjectId;
  productID: Types.ObjectId;
  color?: string;
  size?: string;
  createdAt: Date;
}
