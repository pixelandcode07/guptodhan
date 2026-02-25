import { Schema, model, models } from 'mongoose';

const deviceSchema = new Schema({
  fcmToken: { type: String, required: true, unique: true },
  deviceType: { type: String, enum: ['android', 'ios', 'web'], default: 'android' },
  userId: { type: Schema.Types.ObjectId, ref: 'User', default: null }, // ইউজার লগইন না থাকলে null থাকবে
  isActive: { type: Boolean, default: true },
  lastUsed: { type: Date, default: Date.now }
}, { timestamps: true });

export const Device = models.Device || model('Device', deviceSchema);