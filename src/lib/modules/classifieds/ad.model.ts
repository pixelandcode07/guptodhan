// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\lib\modules\classifieds\ad.model.ts

import { Schema, model, models } from 'mongoose';
import { IClassifiedAd } from './ad.interface';

const classifiedAdSchema = new Schema<IClassifiedAd>({
  title: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: Schema.Types.ObjectId, ref: 'ClassifiedCategory', required: true },
  subCategory: { type: Schema.Types.ObjectId, ref: 'ClassifiedSubCategory' },
  division: { type: String, required: true },
  district: { type: String, required: true }, // নতুন: জেলা যোগ করা হলো
  upazila: { type: String, required: true }, 
  condition: { type: String, enum: ['new', 'used'], required: true },
  authenticity: { type: String, required: true },
  brand: { type: String },
  productModel: { type: String },
  edition: { type: String },
  features: [{ type: String }],
  description: { type: String, required: true },
  price: { type: Number, required: true },
  isNegotiable: { type: Boolean, default: false },
  images: [{ type: String, required: true }],
  contactDetails: {
    name: { type: String, required: true },
    email: { type: String },
    phone: { type: String, required: true },
    isPhoneHidden: { type: Boolean, default: false },
  },
  status: { type: String, enum: ['active', 'sold', 'inactive'], default: 'active' },
}, { timestamps: true });

// ভালো পারফর্মেন্সের জন্য লোকেশনের উপর ইনডেক্স তৈরি করা হলো
classifiedAdSchema.index({ division: 1, district: 1, upazila: 1, status: 1 });

export const ClassifiedAd = models.ClassifiedAd || model<IClassifiedAd>('ClassifiedAd', classifiedAdSchema);