// ফাইল পাথ: src/lib/modules/classifieds/ad.model.ts
import { Schema, model, models } from 'mongoose';
import { IClassifiedAd } from './ad.interface';

// ✅ **পরিবর্তন:** User মডেল ইম্পোর্ট করা হয়েছে
import '@/lib/modules/user/user.model'; // Ensure User model is registered before referencing

const classifiedAdSchema = new Schema<IClassifiedAd>(
  {
    title: { type: String, required: true },
    // এখন 'User' রেফারেন্সটি সঠিকভাবে কাজ করবে
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    category: { type: Schema.Types.ObjectId, ref: 'ClassifiedCategory', required: true },
    subCategory: { type: Schema.Types.ObjectId, ref: 'ClassifiedSubCategory', default: undefined },

    division: { type: String, required: true },
    district: { type: String, required: true },
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
      email: { type: String, default: undefined },
      phone: { type: String, required: true },
      isPhoneHidden: { type: Boolean, default: false },
    },

    status: { type: String, enum: ['active', 'sold', 'inactive'], default: 'active' },
  },
  {
    timestamps: true, // createdAt & updatedAt automatically
  }
);

// Indexing for faster queries
classifiedAdSchema.index({ division: 1, district: 1, upazila: 1, status: 1 });
classifiedAdSchema.index({ brand: 1, productModel: 1, edition: 1 });

export const ClassifiedAd =
  models.ClassifiedAd || model<IClassifiedAd>('ClassifiedAd', classifiedAdSchema);