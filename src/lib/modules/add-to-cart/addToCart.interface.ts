import { Document, Types } from 'mongoose';

export interface ICart extends Document {
  cartID: string;
  userID: Types.ObjectId;
  userName: string;
  userEmail: string;
  productID: Types.ObjectId;
  productName: string;
  productImage: string;
  storeName: string;
  color?: string; 
  size?: string;   
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  createdAt?: Date;
  updatedAt?: Date;
}
