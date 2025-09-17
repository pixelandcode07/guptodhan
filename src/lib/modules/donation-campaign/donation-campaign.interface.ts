import { Document, Types } from 'mongoose';

export interface IDonationCampaign extends Document {
  creator: Types.ObjectId; // User মডেলের রেফারেন্স
  category: Types.ObjectId; // DonationCategory মডেলের রেফারেন্স
  title: string;
  item: 'money' | 'clothes' | 'food' | 'books' | 'other';
  description: string;
  images: string[]; // Cloudinary URL Array
  status: 'active' | 'inactive' | 'completed';
  goalAmount?: number; // যদি item 'money' হয়
  raisedAmount?: number; // এখন পর্যন্ত কত টাকা উঠেছে
}