import { Schema, model, models } from 'mongoose';
import { IDonationClaim } from './donation-claim.interface';

const donationClaimSchema = new Schema<IDonationClaim>({
  item: { type: Schema.Types.ObjectId, ref: 'DonationCampaign', required: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  reason: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected'], 
    default: 'pending' 
  }
}, { timestamps: true });

export const DonationClaim = models.DonationClaim || model<IDonationClaim>('DonationClaim', donationClaimSchema);