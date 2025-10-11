import { Document, Types } from 'mongoose';

export interface IWishlist extends Document {
  wishlistID: string;
  userName: string;
  userEmail: string;
  userID: Types.ObjectId;
  productID: Types.ObjectId;
  createdAt: Date;
}
