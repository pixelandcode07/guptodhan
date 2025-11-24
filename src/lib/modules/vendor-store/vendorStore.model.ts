import { Schema, model, models, Types } from 'mongoose';
import { IStore } from './vendorStore.interface';

const storeSchema = new Schema<IStore>(
  {
    // storeId: { type: String, required: true, unique: true }, 
    vendorId: { type: Schema.Types.ObjectId, ref: 'VendorModel', required: true }, 
    storeLogo: { type: String, required: true },              
    storeBanner: { type: String, required: true },           
    storeName: { type: String, required: true, trim: true },  
    storeAddress: { type: String, required: true },          
    storePhone: { type: String, required: true },            
    storeEmail: { type: String, required: true, unique: true }, 
    vendorShortDescription: { type: String, required: true }, 
    fullDescription: { type: String, required: true },   
    commission: {type:Number},     
    storeSocialLinks: {
      facebook: { type: String },
      whatsapp: { type: String },
      linkedIn: { type: String },
      tiktok: { type: String },
      twitter: { type: String },
      instagram: { type: String },
    },                        
    storeMetaTitle: { type: String },                        
    storeMetaKeywords: [{ type: String }], 
    storeMetaDescription: { type: String },           
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  },
  { timestamps: true }
);

export const StoreModel = models.StoreModel || model<IStore>('StoreModel', storeSchema);
