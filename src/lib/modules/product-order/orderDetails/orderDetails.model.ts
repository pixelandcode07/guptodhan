import { model, models, Schema } from "mongoose";
import { IOrderDetails } from "./orderDetails.interface";

const orderDetailsSchema = new Schema<IOrderDetails>(
  {
    orderDetailsId: {
      type: String,
      required: true,
      unique: true,
    },
    orderId: {
      type: Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
      index: true,
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'VendorProductModel',
      required: true,
      index: true,
    },
    vendorId: {
      type: Schema.Types.ObjectId,
      ref: 'Vendor',
      required: true,
      index: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    unitPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    discountPrice: {
      type: Number,
      min: 0,
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    size: {
      type: String,
    },
    color: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// ✅ Create indexes
orderDetailsSchema.index({ orderId: 1, createdAt: -1 });
// orderDetailsSchema.index({ productId: 1 });
orderDetailsSchema.index({ vendorId: 1 });

// ✅ Properly export the model
// Check if model already exists to avoid "Cannot overwrite model" error
export const OrderDetailsModel = 
  models.OrderDetails || model<IOrderDetails>('OrderDetails', orderDetailsSchema);