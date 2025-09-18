import { Schema, model, models } from 'mongoose';
import { IFAQ } from './faq.interface';

const faqSchema = new Schema<IFAQ>(
  {
    faqID: { type: String, required: true, unique: true },
    category: { type: Schema.Types.ObjectId, ref: 'FAQCategory', required: true },
    question: { type: String, required: true, trim: true },
    answer: { type: String, required: true, trim: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const FAQModel = models.FAQModel || model<IFAQ>('FAQModel', faqSchema);
