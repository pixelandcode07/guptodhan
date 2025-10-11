import { Document, Types } from 'mongoose';

// অর্ডারের প্রতিটি আইটেমের গঠন
export interface IOrderItem {
  product: Types.ObjectId;
  quantity: number;
  price: number; // কেনার সময়কার দাম
}

// মূল অর্ডারের গঠন
export interface IOrder extends Document {
  orderNo: string; // একটি ইউনিক অর্ডার নম্বর
  user: Types.ObjectId;
  items: IOrderItem[];
  totalAmount: number;
  shippingAddress: string;
  contactPhone: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: 'cod' | 'online';
  paymentStatus: 'pending' | 'paid' | 'failed';
  transactionId?: string;
}