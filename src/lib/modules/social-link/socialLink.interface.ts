// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\lib\modules\social-link\socialLink.interface.ts
import { Document } from 'mongoose';

export interface ISocialLink extends Document {
  label: string;
  icon: string; // URL from Cloudinary
  url: string;
}