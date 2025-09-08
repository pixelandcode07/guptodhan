// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\lib\modules\edition\edition.interface.ts
import { Document, Types } from 'mongoose';

export interface IEdition extends Document {
  name: string;
  productModel: Types.ObjectId; // Parent ProductModel reference
  status: 'active' | 'inactive';
}