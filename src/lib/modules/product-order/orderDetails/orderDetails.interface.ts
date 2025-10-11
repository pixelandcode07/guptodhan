import { Document, Types } from 'mongoose';

export interface IOrderDetails extends Document {
  orderDetailsId: string;
  orderId: Types.ObjectId;
  productId: Types.ObjectId;
  vendorId: Types.ObjectId;

  quantity: number;
  unitPrice: number;
  discountPrice?: number;
  totalPrice: number;

  createdAt?: Date;
  updatedAt?: Date;
}
