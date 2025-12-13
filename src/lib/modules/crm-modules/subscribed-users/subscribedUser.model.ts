import { Schema, model, models } from 'mongoose';
import { ISubscriber } from './subscribedUser.interface';

const subscriberSchema = new Schema<ISubscriber>(
  {
    userEmail: { type: String, required: true, unique: true },
    subscribedOn: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const Subscriber =
  models.Subscriber || model<ISubscriber>('Subscriber', subscriberSchema);
