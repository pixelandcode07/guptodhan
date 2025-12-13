import { Schema, model, models } from 'mongoose';
import { IDonationConfig } from './donation-config.interface';

const donationConfigSchema = new Schema<IDonationConfig>({
  title: { type: String, required: true },
  image: { type: String, required: true },
  shortDescription: { type: String, required: true },
  buttonText: { type: String, required: true },
  buttonUrl: { type: String, required: true },
}, { timestamps: true });

export const DonationConfig = models.DonationConfig || model<IDonationConfig>('DonationConfig', donationConfigSchema);