// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\lib\modules\about-content\content.model.ts
import { Schema, model, models } from 'mongoose';
import { IAboutContent } from './content.interface';

const aboutContentSchema = new Schema<IAboutContent>({
  aboutContent: { type: String, required: true },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
}, { timestamps: true });

export const AboutContent = models.AboutContent || model<IAboutContent>('AboutContent', aboutContentSchema);