import { Schema, model, models } from 'mongoose';
import { IDonationCategory } from './donation-category.interface';

const donationCategorySchema = new Schema<IDonationCategory>({
  name: { type: String, required: true, unique: true },
  icon: { type: String },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
}, { timestamps: true });

export const DonationCategory = models.DonationCategory || model<IDonationCategory>('DonationCategory', donationCategorySchema);