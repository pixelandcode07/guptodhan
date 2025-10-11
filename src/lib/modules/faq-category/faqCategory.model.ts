import { Schema, model, models } from 'mongoose';
import { IFAQCategory } from './faqCategory.interface';

const faqCategorySchema = new Schema<IFAQCategory>(
  {
    name: { type: String, required: true, trim: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const FAQCategoryModel =
  models.FAQCategoryModel || model<IFAQCategory>('FAQCategoryModel', faqCategorySchema);
