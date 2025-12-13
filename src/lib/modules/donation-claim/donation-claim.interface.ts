import { Document, Types } from 'mongoose';

export interface IDonationClaim extends Document {
  item: Types.ObjectId;
  name: string;
  phone: string;
  email: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
}