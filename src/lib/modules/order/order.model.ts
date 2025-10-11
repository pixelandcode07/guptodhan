import { Schema, model, models } from 'mongoose';
import { IOrder } from './order.interface';

// অর্ডারের প্রতিটি আইটেমের জন্য সাব-স্কিমা
const orderItemSchema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true },
}, { _id: false });

const orderSchema = new Schema<IOrder>({
  orderNo: { type: String, required: true, unique: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  items: [orderItemSchema],
  totalAmount: { type: Number, required: true },
  shippingAddress: { type: String, required: true },
  contactPhone: { type: String, required: true },
  status: { type: String, enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'], default: 'pending' },
  paymentMethod: { type: String, enum: ['cod', 'online'], required: true },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
  transactionId: { type: String },
}, { timestamps: true });

export const Order = models.Order || model<IOrder>('Order', orderSchema);