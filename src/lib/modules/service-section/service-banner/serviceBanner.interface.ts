import { Document } from 'mongoose';

export interface IServiceBanner extends Document {
  bannerImage: string;

  bannerLink?: string;
  subTitle?: string;
  bannerTitle: string;
  bannerDescription?: string;

  status: 'active' | 'inactive';
}
