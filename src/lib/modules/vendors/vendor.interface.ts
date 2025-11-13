import { Types } from 'mongoose';

export interface IVendor {
  _id?: Types.ObjectId;

  user: Types.ObjectId; // reference to User

  businessName: string;
  businessAddress: string;
  businessCategory: string[]; // array of category IDs
  tradeLicenseNumber: string;

  ownerName: string;

  ownerNidUrl: string;
  tradeLicenseUrl: string;

  storeLogo?: string;
  storeBanner?: string;
  storePhoneNumber?: string;

  status: 'pending' | 'approved' | 'rejected';

  createdAt?: Date;
  updatedAt?: Date;
}
