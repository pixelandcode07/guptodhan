// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\lib\modules\classifieds\subCategory.model.ts
import { Schema, model, models } from 'mongoose';
import { IClassifiedSubCategory } from './subCategory.interface';

const classifiedSubCategorySchema = new Schema<IClassifiedSubCategory>({
  name: { type: String, required: true },
  category: { type: Schema.Types.ObjectId, ref: 'ClassifiedCategory', required: true },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
}, { timestamps: true });

export const ClassifiedSubCategory = models.ClassifiedSubCategory || model<IClassifiedSubCategory>('ClassifiedSubCategory', classifiedSubCategorySchema);