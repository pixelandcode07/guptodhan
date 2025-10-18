import { Schema, model, models } from 'mongoose';
import { IReturnPolicy } from './return-policy.interface';

const returnPolicySchema = new Schema<IReturnPolicy>({
  content: { type: String, required: true },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
}, { timestamps: true });

export const ReturnPolicy = models.ReturnPolicy || model<IReturnPolicy>('ReturnPolicy', returnPolicySchema);