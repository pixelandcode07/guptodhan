// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\lib\modules\vendor\vendor.interface.ts
import { Types } from 'mongoose';

export type TVendor = {
  user: Types.ObjectId; // মূল User মডেলের রেফারেন্স
  businessName: string;
  businessCategory: string; // এটি পরে অন্য মডেলের ref হতে পারে
  tradeLicenseNumber: string;
  businessAddress: string;
  ownerName: string;
  ownerNidUrl: string; // NID কার্ডের ছবির URL
  tradeLicenseUrl: string; // ট্রেড লাইসেন্সের ছবির URL
};