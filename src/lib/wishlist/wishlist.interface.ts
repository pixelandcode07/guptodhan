import { Document, Types } from 'mongoose';

export interface IWishlist extends Document {
  userName: string;
  userEmail: string;
  userID: Types.ObjectId;
  productID: Types.ObjectId;
  createdAt: Date;
}
