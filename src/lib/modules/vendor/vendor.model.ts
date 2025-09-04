// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\lib\modules\vendor\vendor.model.ts
import { Schema, model, models } from 'mongoose';
import { TVendor } from './vendor.interface';

const vendorSchema = new Schema<TVendor>({
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
    unique: true,
  },
  businessName: { type: String, required: true },
  businessCategory: { type: String, required: true },
  tradeLicenseNumber: { type: String, required: true, unique: true },
  businessAddress: { type: String, required: true },
  ownerName: { type: String, required: true },
  ownerNidUrl: { type: String, required: true },
  tradeLicenseUrl: { type: String, required: true },
}, { timestamps: true });

export const Vendor = models.Vendor || model<TVendor>('Vendor', vendorSchema);