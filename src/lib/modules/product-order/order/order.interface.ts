import { Document, Types } from 'mongoose';

export interface IOrder extends Document {
  orderId: string;
  userId: Types.ObjectId;
  storeId?: Types.ObjectId;
  deliveryMethodId?: string;
  paymentMethod?: string;
  transactionId?: string; // For payment gateway transaction ID
  
  // Shipping Info
  shippingName: string;
  shippingPhone: string;
  shippingEmail: string;
  shippingStreetAddress: string;
  shippingCity: string;
  shippingDistrict: string;
  shippingPostalCode: string;
  shippingCountry: string;
  addressDetails?: string;

  // Costs
  deliveryCharge: number;
  totalAmount: number;

  // Statuses
  paymentStatus: 'Pending' | 'Paid' | 'Failed' | 'Refunded' | 'Cancelled';
  // ✅ Added 'Return Request'
  orderStatus: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Returned' | 'Return Request';
  
  // ✅ New Field for Return Logic
  returnReason?: string;

  // Meta
  orderForm: 'Website' | 'App';
  orderDate: Date;
  deliveryDate?: Date;
  
  // Relations
  orderDetails: Types.ObjectId[];
  couponId?: Types.ObjectId;
  
  // Logistics
  parcelId?: string;
  trackingId?: string;

  createdAt?: Date;
  updatedAt?: Date;
}