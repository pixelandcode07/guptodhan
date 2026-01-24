import { Document, Types } from 'mongoose';

export interface IDonationCampaign extends Document {
  creator: Types.ObjectId;
  category: Types.ObjectId;
  title: string;
  item: 'money' | 'clothes' | 'food' | 'books' | 'other';
  description: string;
  images: string[];
  
  moderationStatus: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  
  status: 'active' | 'inactive' | 'completed' | 'archived';
  goalAmount: number;
  raisedAmount: number;
  donorsCount: number;
  
  approvedAt?: Date;
  approvedBy?: Types.ObjectId;
  
  completedAt?: Date;
  
  createdAt: Date;
  updatedAt: Date;
}
