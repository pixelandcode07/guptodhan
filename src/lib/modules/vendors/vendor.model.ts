import { Schema, model, models } from 'mongoose';
import { IVendor } from './vendor.interface';
import '@/lib/modules/user/user.model';

const vendorSchema = new Schema<IVendor>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },

    businessName: { type: String, required: true },
    businessAddress: { type: String, required: true },
    businessCategory: { type: [String], default: [] }, // array
    tradeLicenseNumber: { type: String, required: true },

    ownerName: { type: String, required: true },

    ownerNidUrl: { type: String, required: true },
    tradeLicenseUrl: { type: String, required: true },

    storeLogo: String,
    storeBanner: String,
    storePhoneNumber: String,

    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  },
  { timestamps: true }
);

export const Vendor = models.Vendor || model<IVendor>('Vendor', vendorSchema);
