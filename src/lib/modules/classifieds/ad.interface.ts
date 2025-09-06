// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\lib\modules\classifieds\ad.interface.ts

import { Document, Types } from 'mongoose';

export interface IClassifiedAd extends Document {
  title: string;
  user: Types.ObjectId;
  category: Types.ObjectId;
  subCategory?: Types.ObjectId;
  division: string;
  district: string; // নতুন: জেলা যোগ করা হলো
  upazila: string;  
  condition: 'new' | 'used';
  authenticity: string;
  brand?: string;
  productModel?: string;
  edition?: string;
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