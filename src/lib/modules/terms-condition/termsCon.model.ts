import { Schema, model, models } from 'mongoose';
import { ITerms } from './termsCon.interface';

const termsSchema = new Schema<ITerms>(
  {
    termsId: { type: String, required: true, unique: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    description: { type: String, required: true, trim: true },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const TermsModel = models.TermsModel || model<ITerms>('TermsModel', termsSchema);
