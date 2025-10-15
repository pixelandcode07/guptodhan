import { Schema, model, models } from 'mongoose';
import { IShippingPolicy } from './shipping-policy.interface';

const shippingPolicySchema = new Schema<IShippingPolicy>({
  content: { type: String, required: true },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
}, { timestamps: true });

export const ShippingPolicy = models.ShippingPolicy || model<IShippingPolicy>('ShippingPolicy', shippingPolicySchema);