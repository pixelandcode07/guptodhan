// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\lib\modules\brand\brand.interface.ts

import { Document } from 'mongoose';

export interface IBrand extends Document {
  name: string;
  logo?: string; // URL from Cloudinary
  status: 'active' | 'inactive';
}