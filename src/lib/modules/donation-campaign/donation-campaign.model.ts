import { Schema, model, models } from 'mongoose';
import { IDonationCampaign } from './donation-campaign.interface';

const donationCampaignSchema = new Schema<IDonationCampaign>({
  creator: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: Schema.Types.ObjectId, ref: 'DonationCategory', required: true },
  title: { type: String, required: true },
  item: { type: String, enum: ['money', 'clothes', 'food', 'books', 'other'], required: true },
  description: { type: String, required: true },
  images: [{ type: String, required: true }],
  status: { type: String, enum: ['active', 'inactive', 'completed'], default: 'active' },
  goalAmount: { type: Number },
  raisedAmount: { type: Number, default: 0 },
}, { timestamps: true });

export const DonationCampaign = models.DonationCampaign || model<IDonationCampaign>('DonationCampaign', donationCampaignSchema);