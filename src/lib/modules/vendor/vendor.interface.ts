import { Types } from 'mongoose';

export type TVendor = {
  user: Types.ObjectId;
  businessName: string;
  businessCategory: string;
  tradeLicenseNumber: string;
  businessAddress: string;
  ownerName: string;
  ownerNidUrl: string;
  tradeLicenseUrl: string;
};