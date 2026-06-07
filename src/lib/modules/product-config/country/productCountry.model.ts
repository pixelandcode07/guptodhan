// src/lib/modules/product-config/models/productCountry.model.ts

import { Schema, model, models } from 'mongoose';
import { IProductCountry } from './productCountry.interface';

const productCountrySchema = new Schema<IProductCountry>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    code: {
      type: String,
      trim: true,
      uppercase: true, // BD, US, SA etc. always uppercase
    },
    flag: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
  },
  { timestamps: true }
);

// Fast lookup by name or code
productCountrySchema.index({ name: 1 });
productCountrySchema.index({ code: 1 });
productCountrySchema.index({ status: 1 });

export const ProductCountryModel =
  models.ProductCountry || model<IProductCountry>('ProductCountry', productCountrySchema);