import { Schema, model, models } from "mongoose";
import { IOrder } from "./order.interface";

const orderSchema = new Schema<IOrder>(
  {
    orderId: {
      type:     String,
      required: true,
      unique:   true,
    },
    userId: {
      type:     Schema.Types.ObjectId,
      ref:      "User",
      required: true,
    },
    storeId: {
      type: Schema.Types.ObjectId,
      ref:  "StoreModel",
    },
    deliveryMethodId: {
      type: String,
    },
    paymentMethod: {
      type: String,
    },
    transactionId: {
      type:   String,
      sparse: true,
    },
    shippingName: {
      type:     String,
      required: true,
    },
    shippingPhone: {
      type:     String,
      required: true,
    },
    shippingEmail: {
      type:     String,
      required: true,
    },
    shippingStreetAddress: {
      type:     String,
      required: true,
    },
    shippingCity: {
      type:     String,
      required: true,
    },
    shippingDistrict: {
      type:     String,
      required: true,
    },
    shippingPostalCode: {
      type:     String,
      required: true,
    },
    shippingCountry: {
      type:     String,
      required: true,
      default:  "Bangladesh",
    },
    addressDetails: {
      type: String,
    },
    deliveryCharge: {
      type:    Number,
      default: 0,
    },
    totalAmount: {
      type:     Number,
      required: true,
    },
    paymentStatus: {
      type: String,
      // ✅ FIX: 'Initiated' added — means payment session started,
      // user redirected to SSLCommerz but hasn't paid yet.
      // This is different from 'Pending' (COD / not yet started).
      enum:    ["Initiated", "Pending", "Paid", "Failed", "Refunded", "Cancelled"],
      default: "Pending",
    },
    orderStatus: {
      type: String,
      enum: [
        "Pending",
        "Processing",
        "Shipped",
        "Delivered",
        "Cancelled",
        "Returned",
        "Return Request",
      ],
      default: "Pending",
    },
    returnReason: {
      type: String,
    },
    cancelReason: {
      type: String,
    },
    orderForm: {
      type:    String,
      enum:    ["Website", "App"],
      default: "Website",
    },
    orderDate: {
      type:    Date,
      default: Date.now,
    },
    deliveryDate: {
      type: Date,
    },
    orderDetails: [
      {
        type: Schema.Types.ObjectId,
        ref:  "OrderDetails",
      },
    ],
    parcelId: {
      type: String,
    },
    trackingId: {
      type: String,
    },
    couponId: {
      type: Schema.Types.ObjectId,
      ref:  "PromoCode",
    },
  },
  {
    timestamps: true,
  }
);

// ================================================================
// 🎯 INDEXES
// ================================================================

orderSchema.index({ paymentStatus: 1 });
orderSchema.index({ orderStatus: 1 });
orderSchema.index({ storeId: 1 });
orderSchema.index({ orderDate: -1 });
orderSchema.index({ createdAt: -1 });

orderSchema.index({ userId: 1, orderStatus: 1, createdAt: -1 });
orderSchema.index({ paymentStatus: 1, orderDate: -1 });
orderSchema.index({ storeId: 1, orderStatus: 1, createdAt: -1 });
orderSchema.index({ orderDate: -1, orderStatus: 1, paymentStatus: 1 });
orderSchema.index({ userId: 1, orderStatus: 1, updatedAt: -1 });

export const  OrderModel = models.Order || model<IOrder>("Order", orderSchema);