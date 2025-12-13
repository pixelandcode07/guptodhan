
import { Document, Types } from 'mongoose';

export type TReportReason = 'spam' | 'scam' | 'prohibited_item' | 'false_information' | 'other';
export type TReportStatus = 'pending' | 'under_review' | 'resolved' | 'rejected';

export interface IReport extends Document {
  ad: Types.ObjectId; 
  reporter: Types.ObjectId; 
  reportedUser: Types.ObjectId; 
  reason: TReportReason;
  details: string; 
  status: TReportStatus; 
  adminNotes?: string; 
}