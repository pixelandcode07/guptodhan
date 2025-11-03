import { Schema, model, models } from 'mongoose';
import { IOrder } from './order.interface';

const orderSchema = new Schema<IOrder>(
  {
    orderId: { type: String, required: true, unique: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    storeId: { type: Schema.Types.ObjectId, ref: 'StoreModel', required: true },
    deliveryMethodId: { type: String, default: 'COD' },
    paymentMethod: { type: String, default: 'COD' },

    shippingName: { type: String, required: true },
    shippingPhone: { type: String, required: true },
    shippingEmail: { type: String },
    shippingStreetAddress: { type: String, required: true },
    shippingCity: { type: String, required: true },
    shippingDistrict: { type: String, required: true },
    shippingPostalCode: { type: String, required: true },
    shippingCountry: { type: String, required: true },
    addressDetails: { type: String, required: true },

    deliveryCharge: { type: Number, required: true },
    totalAmount: { type: Number, required: true },

    paymentStatus: {
      type: String,
      enum: ['Pending', 'Paid', 'Failed', 'Refunded'],
      default: 'Pending',
    },
    orderStatus: {
      type: String,
      enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Pending',
    },
    orderForm: { type: String, enum: ['Website', 'App'], required: true },
    orderDate: { type: Date, required: true },
    deliveryDate: { type: Date, required: true },

    parcelId: { type: String },
    trackingId: { type: String },
    couponId: { type: Schema.Types.ObjectId, ref: 'CouponModel' },


    orderDetails: [{ type: Schema.Types.ObjectId, ref: 'OrderDetailsModel' }],
  },
  { timestamps: true }
);

export const OrderModel =
  models.OrderModel || model<IOrder>('OrderModel', orderSchema);
