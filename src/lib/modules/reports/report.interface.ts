// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\lib\modules\reports\report.interface.ts

import { Document, Types } from 'mongoose';

export type TReportReason = 'spam' | 'scam' | 'prohibited_item' | 'false_information' | 'other';
export type TReportStatus = 'pending' | 'under_review' | 'resolved' | 'rejected';

export interface IReport extends Document {
  ad: Types.ObjectId; // যে বিজ্ঞাপনটি রিপোর্ট করা হচ্ছে তার ID
  reporter: Types.ObjectId; // যে ইউজার রিপোর্ট করছে তার ID
  reportedUser: Types.ObjectId; // বিজ্ঞাপনের মালিকের ID
  reason: TReportReason; // রিপোর্টের কারণ
  details: string; // রিপোর্টের বিস্তারিত বর্ণনা
  status: TReportStatus; // রিপোর্টের বর্তমান অবস্থা
  adminNotes?: string; // অ্যাডমিনের মন্তব্য (ঐচ্ছিক)
}