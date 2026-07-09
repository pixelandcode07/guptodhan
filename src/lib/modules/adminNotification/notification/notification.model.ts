import { Schema, model, models } from 'mongoose';

const notificationSchema = new Schema({
  type: {
    type: String,
    enum: ['order', 'vendor_request', 'service_request', 'donation', 'buy_sell_ad', 'report'],
    required: true,
  },
  message: { type: String, required: true },
  link: { type: String, required: true }, // নোটিফিকেশনে ক্লিক করলে অ্যাডমিনকে কোন পেজে নিয়ে যাবে
  isRead: { type: Boolean, default: false },
}, { timestamps: true });

export const Notification = models.Notification || model('Notification', notificationSchema);