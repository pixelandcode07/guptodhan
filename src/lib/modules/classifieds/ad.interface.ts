import { Document, Types } from 'mongoose';

export interface IClassifiedAd extends Document {
  title: string;
  user: Types.ObjectId;
  category: Types.ObjectId;
  subCategory?: Types.ObjectId;
  division: string;
  district: string;
  upazila: string;
  condition: 'new' | 'used';
  authenticity: string;
  brand?: Types.ObjectId;
  productModel?: Types.ObjectId;
  edition?: Types.ObjectId;
  features?: string[];
  description: string;
  price: number;
  isNegotiable: boolean;
  images: string[];
  contactDetails: {
    name: string;
    email?: string;
    phone: string;
    isPhoneHidden: boolean;
  };
  status: 'active' | 'sold' | 'inactive';
}
