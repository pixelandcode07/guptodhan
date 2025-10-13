import { Schema, model, models } from 'mongoose';
import { IClassifiedAd } from './ad.interface';

import '@/lib/modules/user/user.model';
import '@/lib/modules/classifieds-category/category.model';
import '@/lib/modules/classifieds-subcategory/subcategory.model';
import '@/lib/modules/brand/brand.model';
import '@/lib/modules/product-model/productModel.model';
import '@/lib/modules/edition/edition.model';

const classifiedAdSchema = new Schema<IClassifiedAd>(
  {
    title: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    category: { type: Schema.Types.ObjectId, ref: 'ClassifiedCategory', required: true },
    subCategory: { type: Schema.Types.ObjectId, ref: 'ClassifiedSubCategory' },

    division: { type: String, required: true },
    district: { type: String, required: true },
    upazila: { type: String, required: true },

    condition: { type: String, enum: ['new', 'used'], required: true },
    authenticity: { type: String, required: true },

    // ✅ FIX: Changed types from String to ObjectId and added refs
    brand: { type: Schema.Types.ObjectId, ref: 'Brand' },
    productModel: { type: Schema.Types.ObjectId, ref: 'ProductModel' },
    edition: { type: Schema.Types.ObjectId, ref: 'Edition' },

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
  },
  { timestamps: true }
);

// Indexing for faster queries
classifiedAdSchema.index({ division: 1, district: 1, upazila: 1, status: 1 });
classifiedAdSchema.index({ brand: 1, productModel: 1, edition: 1 });

export const ClassifiedAd =
  models.ClassifiedAd || model<IClassifiedAd>('ClassifiedAd', classifiedAdSchema);