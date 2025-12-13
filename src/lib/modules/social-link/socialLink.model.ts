// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\lib\modules\social-link\socialLink.model.ts
import { Schema, model, models } from 'mongoose';
import { ISocialLink } from './socialLink.interface';

const socialLinkSchema = new Schema<ISocialLink>({
  label: { type: String, required: true, unique: true },
  icon: { type: String, required: true },
  url: { type: String, required: true },
}, { timestamps: true });

export const SocialLink = models.SocialLink || model<ISocialLink>('SocialLink', socialLinkSchema);