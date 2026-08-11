import { Schema, model, models } from 'mongoose';
import { IFAQ } from './faq.interface';

const faqSchema = new Schema<IFAQ>(
  {
    faqID: { type: String, required: true, unique: true },
    
    // ✅ MAGIC FIX: String পরিবর্তন করে ObjectId এবং Ref দেওয়া হয়েছে
    category: { 
      type: Schema.Types.ObjectId, 
      ref: 'FAQCategoryModel', 
      required: true 
    },
    
    question: { type: String, required: true, trim: true },
    answer: { type: String, required: true, trim: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const FAQModel = models.FAQModel || model<IFAQ>('FAQModel', faqSchema);