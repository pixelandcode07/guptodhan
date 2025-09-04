import { Schema, model, models } from 'mongoose';
import { TServiceProvider } from './serviceProvider.interface';

const serviceProviderSchema = new Schema<TServiceProvider>({
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
    unique: true,
  },
  bio: { type: String },
  skills: [{ type: String }],
  ratingAvg: { type: Number, default: 0 },
}, { timestamps: true });

export const ServiceProvider = models.ServiceProvider || model<TServiceProvider>('ServiceProvider', serviceProviderSchema);