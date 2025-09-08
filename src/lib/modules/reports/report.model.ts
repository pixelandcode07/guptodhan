// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\lib\modules\reports\report.model.ts

import { Schema, model, models } from 'mongoose';
import { IReport } from './report.interface';

const reportSchema = new Schema<IReport>({
  ad: { type: Schema.Types.ObjectId, ref: 'ClassifiedAd', required: true },
  reporter: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  reportedUser: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  reason: {
    type: String,
    enum: ['spam', 'scam', 'prohibited_item', 'false_information', 'other'],
    required: true,
  },
  details: { type: String, required: true, maxlength: 500 },
  status: {
    type: String,
    enum: ['pending', 'under_review', 'resolved', 'rejected'],
    default: 'pending',
  },
  adminNotes: { type: String },
}, { timestamps: true });

export const Report = models.Report || model<IReport>('Report', reportSchema);