// src/lib/modules/donation-campaign/donation-campaign.interface.ts

import { Document, Types } from 'mongoose';

export interface IDonationCampaign extends Document {
  creator: Types.ObjectId;
  category: Types.ObjectId;
  title: string;
  item: 'money' | 'clothes' | 'food' | 'books' | 'other';
  description: string;
  images: string[];
  status: 'active' | 'inactive' | 'completed';
  
  // ✅ Amount tracking
  goalAmount?: number;
  raisedAmount?: number;
  
  // ✅ Add this field
  donorsCount?: number;  // Number of people who contributed
  
  // ✅ Timestamps
  createdAt?: Date;
  updatedAt?: Date;
}