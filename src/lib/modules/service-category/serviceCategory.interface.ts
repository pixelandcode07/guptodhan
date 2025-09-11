// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\lib\modules\service-category\serviceCategory.interface.ts

import { Document } from 'mongoose';

export interface IServiceCategory extends Document {
  name: string;
  icon?: string; 
  status: 'active' | 'inactive';
}