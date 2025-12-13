import { Document } from 'mongoose';

export interface IDonationConfig extends Document {
  title: string;
  image: string; // Cloudinary URL
  shortDescription: string;
  buttonText: string;
  buttonUrl: string;
}