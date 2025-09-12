import { Schema, model, models } from 'mongoose';
import { IStore } from './vendorStore.interface';

const storeSchema = new Schema<IStore>(
  {
    storeId: { type: String, required: true, unique: true },  // PK storeID
    storeLogo: { type: String, required: true },              // Store Logo
    storeBanner: { type: String, required: true },            // Store Banner
    storeName: { type: String, required: true, trim: true },  // Store Name
    storeAddress: { type: String, required: true },           // Store Address
    storePhone: { type: String, required: true },             // Store Phone
    storeEmail: { type: String, required: true, unique: true }, // Store Email
    vendorShortDescription: { type: String, required: true }, // Vendor Short Description
    fullDescription: { type: String, required: true },        // Full Description
    storeSocialLink: { type: String },                        // Store Social Link
    storeMetaTitle: { type: String },                         // Store Meta Title
    storeMetaKeywords: [{ type: String }],                    // Store Meta Keywords
    status: { type: String, enum: ['active', 'inactive'], default: 'active' }, // Store status
  },
  { timestamps: true }
);

export const StoreModel = models.StoreModel || model<IStore>('StoreModel', storeSchema);
