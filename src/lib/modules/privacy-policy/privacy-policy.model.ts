import { Schema, model, models } from 'mongoose';
import { IPrivacyPolicy } from './privacy-policy.interface';

const privacyPolicySchema = new Schema<IPrivacyPolicy>({
  content: { type: String, required: true },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
}, { timestamps: true });

export const PrivacyPolicy = models.PrivacyPolicy || model<IPrivacyPolicy>('PrivacyPolicy', privacyPolicySchema);