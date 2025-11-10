import { Document, Types } from 'mongoose';

export interface IVendor extends Document {
  user: Types.ObjectId; 
  storeName: string;
  storeLogo?: string;
  storeBanner?: string;
  
  // Documents
  ownerNidUrl: string;
  tradeLicenseUrl: string;
  
  // Status
  status: 'pending' | 'approved' | 'rejected';
  
  // Other details
  storeAddress?: string;
  storePhoneNumber?: string;
}