// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\lib\modules\classifieds-subcategory\subcategory.interface.ts

import { Document, Types } from 'mongoose';

export interface IClassifiedSubCategory extends Document {
  name: string;
  category: Types.ObjectId;
  icon?: string; // নতুন: আইকন ফিল্ড যোগ করা হলো
  status: 'active' | 'inactive';
}