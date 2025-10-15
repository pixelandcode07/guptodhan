import { Schema, model, models } from 'mongoose';
import { ISocialLinks } from './social-links.interface';

const socialLinksSchema = new Schema<ISocialLinks>({
  facebook: { type: String, default: '' },
  twitter: { type: String, default: '' },
  instagram: { type: String, default: '' },
  linkedin: { type: String, default: '' },
  messenger: { type: String, default: '' },
  whatsapp: { type: String, default: '' },
  telegram: { type: String, default: '' },
  youtube: { type: String, default: '' },
  tiktok: { type: String, default: '' },
  pinterest: { type: String, default: '' },
  viber: { type: String, default: '' },
}, { timestamps: true });

export const SocialLinks = models.SocialLinks || model<ISocialLinks>('SocialLinks', socialLinksSchema);