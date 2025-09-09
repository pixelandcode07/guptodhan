// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\lib\modules\about-content\content.interface.ts
import { Document } from 'mongoose';

export interface IAboutContent extends Document {
  aboutContent: string;
  status: 'active' | 'inactive';
}