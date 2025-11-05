import { Document, Types } from 'mongoose';

export interface IOrder extends Document {
  orderId: string;
  userId: Types.ObjectId;
  storeId: Types.ObjectId;
  deliveryMethodId: string;
  paymentMethod: string;

  shippingName: string;
  shippingPhone: string;
  shippingEmail?: string;
  shippingStreetAddress: string;
  shippingCity: string;
  shippingDistrict: string;
  shippingPostalCode: string;
  shippingCountry: string;
  addressDetails: string;

  deliveryCharge: number;
  totalAmount: number;

  paymentStatus: 'Pending' | 'Paid' | 'Failed' | 'Refunded';
  orderStatus: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  orderForm: 'Website' | 'App';
  orderDate: Date;
  deliveryDate: Date;

  transactionId?: string; //for sslcomerze naeem vai
  parcelId?: string;
  trackingId?: string;
  couponId?: Types.ObjectId;


  orderDetails: Types.ObjectId[];

  createdAt?: Date;
  updatedAt?: Date;
}
