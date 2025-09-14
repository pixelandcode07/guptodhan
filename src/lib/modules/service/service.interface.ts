// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\lib\modules\service\service.interface.ts

import { Document, Types } from 'mongoose';

export interface IService extends Document {
  provider: Types.ObjectId;
  title: string;
  description: string;
  price: number;
  category: Types.ObjectId; // ServiceCategory মডেলের রেফারেন্স
  subCategory?: Types.ObjectId; // ServiceSubCategory মডেলের রেফারেন্স
  location: {
    division: string;
    district: string;
    upazila: string;
  };
  images: string[]; // সেবার ছবির URL
  status: 'available' | 'unavailable';
}