import { Document } from 'mongoose';

export interface ISocialLinks extends Document {
  facebook?: string;
  twitter?: string;
  instagram?: string;
  linkedin?: string;
  messenger?: string;
  whatsapp?: string;
  telegram?: string;
  youtube?: string;
  tiktok?: string;
  pinterest?: string;
  viber?: string;
}