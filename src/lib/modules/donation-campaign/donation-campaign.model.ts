// src/lib/modules/donation-campaign/donation-campaign.model.ts

import { Schema, model, models } from 'mongoose';
import { IDonationCampaign } from './donation-campaign.interface';

const donationCampaignSchema = new Schema<IDonationCampaign>({
  creator: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    index: true
  },
  category: { 
    type: Schema.Types.ObjectId, 
    ref: 'DonationCategory', 
    required: true,
    index: true
  },
  title: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 200
  },
  item: { 
    type: String, 
    enum: ['money', 'clothes', 'food', 'books', 'other'], 
    required: true,
    index: true
  },
  description: { 
    type: String, 
    required: true 
  },
  images: [
    { 
      type: String, 
      required: true 
    }
  ],
  status: { 
    type: String, 
    enum: ['active', 'inactive', 'completed'], 
    default: 'active',
    index: true
  },
  
  // ✅ Amount tracking
  goalAmount: { 
    type: Number,
    default: 0
  },
  raisedAmount: { 
    type: Number, 
    default: 0
  },
  
  // ✅ Add donorsCount
  donorsCount: {
    type: Number,
    default: 0
  }
}, { 
  timestamps: true 
});

// ✅ Indexes for better performance
donationCampaignSchema.index({ status: 1, createdAt: -1 });
donationCampaignSchema.index({ creator: 1, status: 1 });

export const DonationCampaign = models.DonationCampaign || 
  model<IDonationCampaign>('DonationCampaign', donationCampaignSchema);