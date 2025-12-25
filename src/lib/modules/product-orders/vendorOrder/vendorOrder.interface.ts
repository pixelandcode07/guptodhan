import { Document, Types } from "mongoose";

export interface IVendorOrder extends Document {
  // Relations
  orderId: Types.ObjectId;        // parent order
  vendorId: Types.ObjectId;
  vendorName?: string;

  // Status (vendor controls this)
  vendorStatus:
    | "Pending"
    | "Accepted"
    | "Processing"
    | "Shipped"
    | "Delivered"
    | "Return Requested"
    | "Returned"
    | "Cancelled";

  // Amounts (vendor specific)
  productTotal: number;
  deliveryCharge: number;          // based on totalWeight + courier
  payableAmount: number;           // productTotal + deliveryCharge

  // Logistics
  deliveryMethod?: "Regular" | "Express" | "Same Day";
  totalWeight?: number;            // sum of product weights
  courierName?: string;
  parcelId?: string;
  trackingId?: string;

  shippedAt?: Date;
  deliveredAt?: Date;

  // Relations
  orderDetails: Types.ObjectId[]; // references OrderDetails

  createdAt?: Date;
  updatedAt?: Date;
}