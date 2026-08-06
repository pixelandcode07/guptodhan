import { Schema, model, models } from 'mongoose';
import { IDonationCampaign } from './donation-campaign.interface';

const donationCampaignSchema = new Schema<IDonationCampaign>(
  {
    creator: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    category: { type: Schema.Types.ObjectId, ref: 'DonationCategory', required: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 200 },
    item: { type: String, enum: ['money', 'clothes', 'food', 'books', 'other'], required: true, index: true },
    description: { type: String, required: true },
    images: [{ type: String, required: true }],
    
    moderationStatus: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending', index: true },
    rejectionReason: { type: String, default: null },
    status: { type: String, enum: ['active', 'inactive', 'completed', 'archived'], default: 'inactive', index: true },
    
    // MONEY TRACKING
    goalAmount: { type: Number, default: 0 },
    raisedAmount: { type: Number, default: 0 },

    // ✅ NEW: QUANTITY & DATE FOR NON-MONEY ITEMS
    quantity: { type: Number, default: 1 }, 
    endDate: { type: Date, default: null }, 

    donorsCount: { type: Number, default: 0 },
    approvedAt: { type: Date, default: null },
    approvedBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    completedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

donationCampaignSchema.index({ moderationStatus: 1, createdAt: -1 });
donationCampaignSchema.index({ status: 1, moderationStatus: 1 });
donationCampaignSchema.index({ creator: 1, moderationStatus: 1 });

export const DonationCampaign = models.DonationCampaign || model<IDonationCampaign>('DonationCampaign', donationCampaignSchema);