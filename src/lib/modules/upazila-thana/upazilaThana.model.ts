import { Schema, model, models } from 'mongoose';
import { IUpazilaThana } from './upazilaThana.interface';

const upazilaThanaSchema = new Schema<IUpazilaThana>(
  {
    district: { type: String, required: true, trim: true },
    upazilaThanaEnglish: { type: String, required: true, trim: true },
    upazilaThanaBangla: { type: String, required: true, trim: true },
    websiteLink: { type: String, trim: true },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const UpazilaThanaModel =
  models.UpazilaThanaModel || model<IUpazilaThana>('UpazilaThanaModel', upazilaThanaSchema)
