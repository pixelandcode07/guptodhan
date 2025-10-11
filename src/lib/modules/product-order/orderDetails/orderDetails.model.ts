import { Schema, model, models } from 'mongoose';
import { IOrderDetails } from './orderDetails.interface';

const orderDetailsSchema = new Schema<IOrderDetails>(
  {
    orderDetailsId: { type: String },
    orderId: { type: Schema.Types.ObjectId, ref: 'OrderModel', required: true },
    productId: { type: Schema.Types.ObjectId, ref: 'ProductModel', required: true },
    vendorId: { type: Schema.Types.ObjectId, ref: 'VendorModel', required: true },

    quantity: { type: Number, required: true },
    unitPrice: { type: Number, required: true },
    discountPrice: { type: Number, default: 0 },
    totalPrice: { type: Number, required: true },
  },
  { timestamps: true }
);

export const OrderDetailsModel =
  models.OrderDetailsModel || model<IOrderDetails>('OrderDetailsModel', orderDetailsSchema);
