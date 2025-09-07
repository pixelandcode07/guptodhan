// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\lib\modules\classifieds\subCategory.interface.ts
import { Document, Types } from 'mongoose';

export interface IClassifiedSubCategory extends Document {
  name: string;
  category: Types.ObjectId; // Parent category reference
  status: 'active' | 'inactive';
}