import { Document, Types } from "mongoose";

export interface IOrder extends Document {
  // Identity
  orderId: string;
  userId: Types.ObjectId;

  // Payment
  paymentMethod?: string;
  paymentStatus: "Pending" | "Paid" | "Failed" | "Refunded";
  transactionId?: string;

  // Shipping (same for all vendors)
  shippingName: string;
  shippingPhone: string;
  shippingEmail?: string;
  shippingAddress: string;
  shippingCity: string;
  shippingDistrict: string;
  shippingPostalCode?: string;
  shippingCountry: string;

  // Totals 
  subtotal: number;               // sum of all product totals
  totalDeliveryCharge: number;    // sum of vendor delivery charges
  totalAmount: number;            // subtotal + delivery

  // Order state 
  orderStatus:
    | "Pending"
    | "Paid"
    | "Partially Shipped"
    | "Fully Shipped"
    | "Completed"
    | "Cancelled";

  // Relations
  vendorOrders: Types.ObjectId[]; 

  // Meta
  orderFrom: "Website" | "App";
  orderDate: Date;

  createdAt?: Date;
  updatedAt?: Date;
}
