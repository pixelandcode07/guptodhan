// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\lib\modules\product-model\productModel.interface.ts
import { Document, Types } from 'mongoose';

export interface IProductModel extends Document {
  name: string;
  brand: Types.ObjectId;
  status: 'active' | 'inactive';
}