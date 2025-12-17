import { Document, Types } from 'mongoose';

export interface IOrder extends Document {
  orderId: string;
  userId: Types.ObjectId;
  storeId?: Types.ObjectId;
  deliveryMethodId?: string;
  paymentMethod?: string;
  
  // ✅ IMPORTANT: Transaction ID field for payment tracking
  transactionId?: string;
  
  shippingName: string;
  shippingPhone: string;
  shippingEmail: string;
  shippingStreetAddress: string;
  shippingCity: string;
  shippingDistrict: string;
  shippingPostalCode: string;
  shippingCountry: string;
  addressDetails?: string;
  
  deliveryCharge: number;
  totalAmount: number;
  
  paymentStatus: 'Pending' | 'Paid' | 'Failed' | 'Refunded' | 'Cancelled';
  orderStatus: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Returned';
  
  orderForm: 'Website' | 'App';
  orderDate: Date;
  deliveryDate?: Date;
  
  orderDetails?: Types.ObjectId[];
  
  parcelId?: string;
  trackingId?: string;
  
  couponId?: Types.ObjectId;
  
  createdAt?: Date;
  updatedAt?: Date;
}