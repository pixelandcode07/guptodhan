import { Schema, model, models } from 'mongoose';
import { IVendor } from './vendor.interface';
import '@/lib/modules/user/user.model'; // Import User model to register it for population

const vendorSchema = new Schema<IVendor>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  storeName: {
    type: String,
    required: true,
    unique: true,
  },
  storeLogo: {
    type: String,
  },
  storeBanner: {
    type: String,
  },
  ownerNidUrl: {
    type: String,
    required: true,
  },
  tradeLicenseUrl: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  storeAddress: {
    type: String,
  },
  storePhoneNumber: {
    type: String,
  },
}, { timestamps: true });

export const Vendor = models.Vendor || model<IVendor>('Vendor', vendorSchema);