import { Schema, model, models } from 'mongoose';
import { IOrderDetails } from './orderDetails.interface';
// Import models to ensure they're registered
import { VendorProductModel } from '@/lib/modules/product/vendorProduct.model';
import { Vendor } from '@/lib/modules/vendor/vendor.model';

const orderDetailsSchema = new Schema<IOrderDetails>(
  {
    orderDetailsId: { type: String },
    orderId: { type: Schema.Types.ObjectId, ref: 'OrderModel', required: true },
    productId: { type: Schema.Types.ObjectId, ref: 'VendorProductModel', required: true },
    vendorId: { type: Schema.Types.ObjectId, ref: 'Vendor', required: true },

    quantity: { type: Number, required: true },
    unitPrice: { type: Number, required: true },
    discountPrice: { type: Number, default: 0 },
    totalPrice: { type: Number, required: true },
    size: { type: String },
    color: { type: String },
  },
  { timestamps: true }
);

export const OrderDetailsModel =
  models.OrderDetailsModel || model<IOrderDetails>('OrderDetailsModel', orderDetailsSchema);
