import { Schema, model, models } from 'mongoose';

const ServiceBannerSchema = new Schema(
  {
    bannerImage: {
      type: String,
      required: true,
      trim: true,
    },
    bannerLink: {
      type: String,
      trim: true,
    },
    subTitle: {
      type: String,
      trim: true,
    },
    bannerTitle: {
      type: String,
      required: true,
      trim: true,
    },
    bannerDescription: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    }
  },
  {
    timestamps: true,
  }
);

export const ServiceBanner =
  models.ServiceBanner || model('ServiceBanner', ServiceBannerSchema);
