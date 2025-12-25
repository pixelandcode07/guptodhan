import { Document, Types } from "mongoose";

export interface IOrderDetails extends Document {
  // Relations
  orderId: Types.ObjectId;
  vendorOrderId: Types.ObjectId;
  productId: Types.ObjectId;
  vendorId: Types.ObjectId;

  // Product snapshot
  productName: string;
  weight?: number;                // product weight for shipment calculation

  // Pricing
  quantity: number;
  unitPrice: number;
  discountPrice?: number;
  totalPrice: number;

  // Variants
  size?: string;
  color?: string;

  createdAt?: Date;
  updatedAt?: Date;
}
