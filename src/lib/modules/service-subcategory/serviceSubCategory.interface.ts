  // ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\lib\modules\service-subcategory\serviceSubCategory.interface.ts

  import { Document, Types } from 'mongoose';

  export interface IServiceSubCategory extends Document {
    name: string;
    category: Types.ObjectId; // Parent ServiceCategory reference
    status: 'active' | 'inactive';
  }