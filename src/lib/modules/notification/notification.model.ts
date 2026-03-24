import { Schema, model, models } from 'mongoose';

const notificationSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', default: null }, 
  title: { type: String, required: true },
  message: { type: String, required: true },
  image: { type: String },
  type: { type: String, enum: ['broadcast', 'individual'], default: 'broadcast' },
  status: { type: String, enum: ['sent', 'failed'], default: 'sent' },
  sentAt: { type: Date, default: Date.now }
}, { timestamps: true });

export const Notification = models.Notification || model('Notification', notificationSchema);